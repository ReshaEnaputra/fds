<template>
    <div class="center-chart">
        <apexchart width="600" type="pie" :options="chartOptions" :series="this.dataList">
        </apexchart>
    </div>
</template>

<script>
export default {
    props: {
        dataList: Array,
        title: String,
        headers: Array,
        colors: Array
    },
    name: "Apex charts",
    data() {
        return {
            chartOptions: {
                chart: {
                    id: "apexchart-example",
                },
                title: {
                    text: this.title,
                    align: "center",
                    margin: 40,
                    style: {
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#263238",
                    },
                },
                colors: this.colors,
                dataLabels: {
                    enabled: true,
                },
                legend: {
                    show: true,
                    position: 'right',
                },
                labels: this.headers,
            },
        };
    },
};
</script>

<style scoped>
    .center-chart {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>