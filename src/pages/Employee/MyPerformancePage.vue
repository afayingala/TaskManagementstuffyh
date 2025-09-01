<template>
    <q-page padding>
      <div class="q-pa-md">
        <!-- Page Title -->
        <div class="text-h5 q-mb-lg">📊 My Performance</div>
  
        <!-- Chart Card -->
        <q-card flat bordered class=" q-pa-md">
          <q-card-section>
            <div class="text-subtitle1">Weekly Productivity Trend</div>
          </q-card-section>
  
          <q-separator />
  
          <q-card-section>
            <!-- Chart Component -->
            <apexchart
              width="100%"
              height="350"
              type="line"
              :options="chartOptions"
              :series="series"
            />
          </q-card-section>
        </q-card>
  
        <!-- Stats Section -->
        <div class="metric-cards row q-col-gutter-md q-mt-lg justify-around">
          <q-card class="col-xs-12 col-md-5 bg-green-1">
            <q-card-section>
              <div class="text-h6 text-green">Performance Matrics</div>
              <div class="text-h10">Overall Score: 92%</div>
              <div class="text-h10">Task Completed: {{ stats.completed }}</div>
              <div class="text-h10">Ontime Rate: 70%</div>
            </q-card-section>
          </q-card>
  
          <q-card class="col-12 col-md-5 bg-orange-1">
            <q-card-section>
              <div class="text-h6 text-orange">Task Status Breakdown</div>
              <div class="text-h10">To-Do: 7</div>
              <div class="text-h10">In-Progress: 4</div>
              <div class="text-h10">Task Completed: {{ stats.completed }}</div>
              <div class="text-h10">Task Pending: {{ stats.pending }}</div>
              <div class="text-h10">Task Overdue: {{ stats.overdue }}</div>
            </q-card-section>
          </q-card>
  
          <!-- <q-card class="col-12 col-md-3 bg-red-1">
            <q-card-section>
              <div class="text-h6 text-red">❌ Overdue</div>
              <div class="text-h5">{{ stats.overdue }}</div>
            </q-card-section>
          </q-card> -->
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import VueApexCharts from "vue3-apexcharts";
  
  // register component
  const apexchart = VueApexCharts;
  
  // dummy stats
  const stats = ref({
    completed: 42,
    pending: 15,
    overdue: 3,
  });
  
  // chart data
  const series = ref([
    {
      name: "Tasks Completed",
      data: [5, 9, 7, 14, 20, 25, 30],
    },
  ]);
  
  const chartOptions = ref({
    chart: {
      id: "performance-chart",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#21ba45"],
    markers: {
      size: 5,
      colors: ["#21ba45"],
    },
    dataLabels: {
      enabled: true,
    },
  });
  </script>

  <style scoped>
  .metric-cards {
  /* display: flex;
  flex-wrap: wrap;
  justify-content: space-between; */
   gap: 16px; /*Spacing between cards */
}

</style>