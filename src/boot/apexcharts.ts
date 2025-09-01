import { boot } from 'quasar/wrappers'
import VueApexCharts from 'vue3-apexcharts'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // Register ApexCharts as a global component
  app.use(VueApexCharts)
  
  // Alternative: Register as a component with a specific name
  // app.component('apexchart', VueApexCharts)
})