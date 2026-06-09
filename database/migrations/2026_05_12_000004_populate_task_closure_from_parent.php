<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Build ancestor -> descendant links for tasks that have parent_id set
        $tasks = DB::table('tasks')->select('id', 'parent_id')->get()->toArray();

        // compute depth (distance to root) for each task
        $depths = [];
        $byId = [];
        foreach ($tasks as $t) {
            $byId[$t->id] = $t->parent_id;
        }

        $computeDepth = function ($id) use (&$computeDepth, $byId, &$depths) {
            if (isset($depths[$id])) return $depths[$id];
            $parent = $byId[$id] ?? null;
            if (! $parent) {
                $depths[$id] = 0;
                return 0;
            }
            $depths[$id] = 1 + $computeDepth($parent);
            return $depths[$id];
        };

        foreach (array_keys($byId) as $id) {
            $computeDepth($id);
        }

        // sort tasks by depth ascending so parents are processed before children
        uasort($depths, function ($a, $b) { return $a <=> $b; });

        foreach ($depths as $taskId => $d) {
            $parentId = $byId[$taskId] ?? null;
            if (! $parentId) continue;

            // get all ancestors of parent (should exist at least as self entries)
            $parentAncestors = DB::table('task_closure')->where('descendant_id', $parentId)->get();

            // get current descendants of task (may be only self or already inserted children)
            $taskDescendants = DB::table('task_closure')->where('ancestor_id', $taskId)->pluck('descendant_id', 'descendant_id')->toArray();

            $inserts = [];
            foreach ($parentAncestors as $pa) {
                foreach ($taskDescendants as $descendantId) {
                    // compute depth from ancestor to descendant
                    // ancestor->parent has depth pa.depth, parent->task is 1, task->descendant is existing depth (fetch)
                    $taskToDescDepth = DB::table('task_closure')->where('ancestor_id', $taskId)->where('descendant_id', $descendantId)->value('depth');
                    $depthValue = $pa->depth + 1 + ($taskToDescDepth ?? 0);

                    $inserts[] = [
                        'ancestor_id' => $pa->ancestor_id,
                        'descendant_id' => $descendantId,
                        'depth' => $depthValue,
                    ];
                }
            }

            if (! empty($inserts)) {
                // avoid duplicate primary key errors by ignoring existing rows
                foreach (array_chunk($inserts, 200) as $chunk) {
                    DB::table('task_closure')->insertOrIgnore($chunk);
                }
            }
        }
    }

    public function down(): void
    {
        // no-op: manual cleanup may be required; keep migration irreversible by default
    }
};
