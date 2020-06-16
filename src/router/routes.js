const routes = [
  {
    path: "/",
    component: () => import("layouts/Main.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/room",
    component: () => import("layouts/Room.vue"),
    children: [
      { path: ":roomId", component: () => import("pages/RoomIndex.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
