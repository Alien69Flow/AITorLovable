// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import cesium from "file:///home/project/node_modules/vite-plugin-cesium/dist/index.mjs";
import { mcpPlugin } from "file:///home/project/node_modules/@lovable.dev/mcp-js/dist/stacks/supabase/vite.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    cesium(),
    mcpPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__vite_injected_original_dirname, "./src") },
      { find: /^three$/, replacement: path.resolve(__vite_injected_original_dirname, "./node_modules/three/build/three.module.js") },
      { find: /^three\/webgpu$/, replacement: path.resolve(__vite_injected_original_dirname, "./node_modules/three/build/three.webgpu.js") },
      { find: /^three\/examples\/jsm\/(.*)$/, replacement: path.resolve(__vite_injected_original_dirname, "./node_modules/three/examples/jsm/$1") }
    ],
    dedupe: ["three", "react", "react-dom"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCBjZXNpdW0gZnJvbSBcInZpdGUtcGx1Z2luLWNlc2l1bVwiO1xuaW1wb3J0IHsgbWNwUGx1Z2luIH0gZnJvbSBcIkBsb3ZhYmxlLmRldi9tY3AtanMvc3RhY2tzL3N1cGFiYXNlL3ZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjZXNpdW0oKSxcbiAgICBtY3BQbHVnaW4oKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAgeyBmaW5kOiBcIkBcIiwgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIikgfSxcbiAgICAgIHsgZmluZDogL150aHJlZSQvLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL25vZGVfbW9kdWxlcy90aHJlZS9idWlsZC90aHJlZS5tb2R1bGUuanNcIikgfSxcbiAgICAgIHsgZmluZDogL150aHJlZVxcL3dlYmdwdSQvLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL25vZGVfbW9kdWxlcy90aHJlZS9idWlsZC90aHJlZS53ZWJncHUuanNcIikgfSxcbiAgICAgIHsgZmluZDogL150aHJlZVxcL2V4YW1wbGVzXFwvanNtXFwvKC4qKSQvLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vJDFcIikgfSxcbiAgICBdLFxuICAgIGRlZHVwZTogW1widGhyZWVcIiwgXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLFlBQVk7QUFDbkIsU0FBUyxpQkFBaUI7QUFMMUIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsRUFDNUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUVoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sS0FBSyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxPQUFPLEVBQUU7QUFBQSxNQUMzRCxFQUFFLE1BQU0sV0FBVyxhQUFhLEtBQUssUUFBUSxrQ0FBVyw0Q0FBNEMsRUFBRTtBQUFBLE1BQ3RHLEVBQUUsTUFBTSxtQkFBbUIsYUFBYSxLQUFLLFFBQVEsa0NBQVcsNENBQTRDLEVBQUU7QUFBQSxNQUM5RyxFQUFFLE1BQU0sZ0NBQWdDLGFBQWEsS0FBSyxRQUFRLGtDQUFXLHNDQUFzQyxFQUFFO0FBQUEsSUFDdkg7QUFBQSxJQUNBLFFBQVEsQ0FBQyxTQUFTLFNBQVMsV0FBVztBQUFBLEVBQ3hDO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
