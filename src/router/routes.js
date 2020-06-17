const routes = [
  {
    path: "/",
    component: () => import("layouts/Main.vue"),
    children: [
      {
        name: "index",
        path: "",
        component: () => import("pages/Index.vue")
      }
    ]
  },
  {
    path: "/room",
    component: () => import("layouts/Room.vue"),
    children: [
      {
        name: "room",
        path: ":roomId",
        component: () => import("pages/RoomIndex.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("layouts/Login.vue"),
    children: [
      {
        name: "login",
        path: "",
        component: () => import("pages/SelectUser.vue")
      }
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
