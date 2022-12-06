<template>
  <div class="book">
    <div class="page">
        <div class="row">
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
        </div>  
    </div>
    <div class="page">
        <div class="row">
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
            <div class="card" >
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum nemo, ut facere fuga tempora illo. Ipsum fugiat ipsam maxime, voluptatem alias eaque corrupti, ut iusto consequatur eligendi quia quidem nam?</p>
            </div>
        </div>   
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
    body {
        margin: 0;
        padding: 0;
        background-color: #FAFAFA;
        font: 12pt "Tahoma";
    }
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }
    .page {
        width: 21cm;
        min-height: 29.7cm;
        margin: auto;
        border: 1px #D3D3D3 solid;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
    .subpage {
        padding: 1cm;
        border: 5px red solid;
        height: 256mm;
        outline: 2cm #FFEAEA solid;
    }
    .row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 16px;
        height: inherit;
		}
    .card {
			border: 1px solid #ccc;
			height: 100%;
		}
    
    @page {
        size: A4;
        margin: 0;
    }
    @media print {
        .page {
            margin: 0;
            border: initial;
            border-radius: initial;
            width: initial;
            min-height: initial;
            box-shadow: initial;
            background: initial;
            page-break-after: always;
        }
    }
</style>