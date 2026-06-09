<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $taskIds = DB::table('tasks')->pluck('id')->toArray();

        $inserts = array_map(function ($id) {
            return [
                'ancestor_id' => $id,
                'descendant_id' => $id,
                'depth' => 0,
            ];
        }, $taskIds);

        $chunks = array_chunk($inserts, 500);
        foreach ($chunks as $chunk) {
            DB::table('task_closure')->insert($chunk);
        }
    }

    public function down(): void
    {
        // remove self entries only
        DB::table('task_closure')->whereRaw('ancestor_id = descendant_id')->delete();
    }
};
