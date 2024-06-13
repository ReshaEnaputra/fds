<template>
    <div class="center-chart">
        <apexchart width="650" type="bar" :options="chartOptions" :series="[{data: dataList}]">
        </apexchart>
    </div>
</template>

<script>
export default {
    props: {
        dataList: Array,
        title: String,
        headers: Array,
        colors: Array,
        horizontal: Boolean
    },
    name: "Apex charts",
    watch: {
        headers(val) {
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    categories: val,
                    labels: {
                        style: {
                            colors: this.colors,
                            fontSize: '14px'
                        }
                    }
                }
            }
        }
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    type: 'bar',
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
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                        horizontal: this.horizontal
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: this.headers,
                    labels: {
                        style: {
                            colors: this.colors,
                            fontSize: '14px'
                        }
                    }
                }
            }
        }
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