<template>
	<div class="container">
		<div class="paper">
			<div class="one-quit" v-for="i in tab" :ke="i">
				<div class="qt-header" >
					<div><img src="/static/logo.png"></div>
					<div>
						<div><strong>MEGA FINANCIAL OPPORTUNITY</strong></div>
						<div class="retrait-depot">
							<div><strong>Dépôt</strong></div><span class="case" ></span>
							<div><strong>Retrait</strong></div><span class="case" ></span>
						</div>
					</div>
				</div>
				<br>
				<div><strong>No  : {{zfill(i)}}</strong></div>
				<div class="body">
					<p><strong>Effectué par :
						..............................................................
					</strong></p>
					<p><strong>Titulaire du compte :
						.................................................
					</strong></p>
					<p><strong>Numéro du compte :
						.................................................
					</strong></p>
					<p><strong>Montant :
						....................................................................
						.....................................................................................

					</strong></p>
					<p><strong>Motif :
						.........................................................................
					</strong></p>
					<p><strong>Date et Signature (s) :
					</strong></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				start:0,
				end:0,
				tab:[]
			}
		},
		beforeMount(){
			this.start = parseInt(this.$route.params.range.split("-")[0])
			this.end = parseInt(this.$route.params.range.split("-")[1])
			for(let i=this.start;i<=this.end;i++){
				this.tab.push(i)
			}
		},
		methods:{
			zfill(number){
				if(typeof(number)!="string")
					number=""+number
				let z_filled=""
				let range = 7-number.length
				for(let i=0;i<range;i++){
					z_filled+="0"
				}
			return "SCHEKINAH/"+z_filled+number
			},
		}
	}
</script>
<style scoped>
	@media print {
		*{
			font-family: "arial";
		}
	}
	.paper{
		width: 21cm;
		height: 27.9cm;
		margin: auto;
		background-color: white;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 16px;
	}
	img{
		width:60px;
		height:60px;
	}
	.retrait-depot{
		min-width:100px;
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.retrait-depot>div{
		padding:15px;
	}
	span{
		min-width:100px;
		min-height:100px;
		border:1px solid black;
	}
	.one-quit{
		height: 100%;
		display:flex;
		justify-content:center;
		align-items:center;
		flex-direction:column;
		border:1px solid black;
		padding:15px;
		border-radius:2cm;
		break-inside: avoid;
	}
	.qt-header{
		display:flex;
		justify-content:center;
		align-items:center
	}
	p{
		margin-bottom:7px;
	}
	.case{
		border:2px solid black;
		min-width:20px;
		min-height:20px;
	}
</style>