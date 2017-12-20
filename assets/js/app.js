var pokedex = angular.module('pokedexApp',['ngRoute']);

pokedex.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/home.html',
		controller: 'home'
	})
	.when('/details/:id',{
		templateUrl:'views/detail.html',
		controller: 'detail'
	})

})

pokedex.controller('home',function($scope,$http){
	$(window).on('scroll',function(){
		var wScroll = $(this).scrollTop()
		var w1 = document.querySelector('#bg2');
		w1.style.bottom=wScroll*0.25+'px';
	});

	$scope.pokemonlist=[];
  $http.get("/db/pokedexdataset.json")
  .then(function(response){
  		var list = response.data.pokemon;
			$scope.list2 = list;
			// console.log($scope.list2)
			for(i=0;i<list.length;i++){
				for (j = 0; j < (list.length - i - 1); j++){
            if (list[j].spawn_chance < list[j + 1].spawn_chance){
                temp = list[j]
                list[j] = list[j + 1]
                list[j + 1] = temp
            }
        }
			}

			for(i=0;i<list.length;i++){
				$scope.pokemonlist.push(list[i]);
			}

			justlist=[];
			function wlist(name,count){
				this.name = name;
				this.count = count;
			}
			$scope.wCountList = justlist;
			// console.log($scope.wCountList);

			for (i = 0; i < $scope.pokemonlist.length; i++) {
				for (j = 0; j < $scope.pokemonlist[i].weaknesses.length; j++) {
					checkWeaknessCount($scope.pokemonlist[i].weaknesses[j]);
				}
			}

			function checkWeaknessCount(wName){
				var count = 1;
				var flag = 0;
				for(m=0;m<10;m++){
					for(n = 0; n < $scope.pokemonlist[m].weaknesses.length; n++){
						if(wName == $scope.pokemonlist[m].weaknesses[n]){
							for(x=0;x<justlist.length;x++){
								if(wName == justlist[x].name){
									var flag = 1;
									justlist[x].count = count++;
								}
							}
							if(flag!=1){
								var wset = new wlist(wName,count);
								justlist.push(wset);
							}
						}
					}
				}
			}
  	},function(xhr){
  		console.log(xhr)
  	});
});


pokedex.controller("detail",function($scope,$routeParams,$http){
	$scope.pokelist=[]
	$http.get("/db/pokedexdataset.json")
	.then(function(response){
		var list = response.data.pokemon
		console.log("here it comes")
		$scope.nEvoList=[]
		
		for(var i=0;i<list[$routeParams.id-1].next_evolution.length;i++){
			for(j=0;j<list.length;j++){
				if(list[$routeParams.id-1].next_evolution[i].num == list[j].num){
					$scope.nEvoList.push(list[j])
				}
			}
		}
		console.log($scope.nEvoList)
		$scope.pokelist = list[$routeParams.id-1]
		console.log($scope.pokelist)
		// document.getElementById('test').innerHTML="hello"+ $scope.pokelist.next_evolution[0].name;
	},function(xhr){
		console.log(xhr)
	})
});
