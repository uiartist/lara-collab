import Layout from "@/layouts/MainLayout";
import { usePage } from "@inertiajs/react";
import { Title } from "@mantine/core";
import Masonry from "react-masonry-css";
import OverdueTasks from "./Cards/OverdueTasks";
import { ProjectCard } from "./Cards/ProjectCard";
import RecentComments from "./Cards/RecentComments";
import RecentlyAssignedTasks from "./Cards/RecentlyAssignedTasks";
import classes from "./css/Index.module.css";
import CircularMenu from "@/components/CircularMenu";

const Dashboard = () => {
  const { projects, overdueTasks, recentlyAssignedTasks, recentComments } = usePage().props;

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      <Title mb="md">Dashboard</Title>
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
        <div style={{ marginLeft: 8 }}>
          <CircularMenu size={360} radius={0.65} />
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumns}
        className={classes.myMasonryGrid}
        columnClassName={classes.myMasonryGridColumn}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <OverdueTasks tasks={overdueTasks} />
        <RecentlyAssignedTasks tasks={recentlyAssignedTasks} />
        <RecentComments comments={recentComments} />
      </Masonry>
    </>
  );
};

Dashboard.layout = (page) => <Layout title="Dashboard">{page}</Layout>;

export default Dashboard;
