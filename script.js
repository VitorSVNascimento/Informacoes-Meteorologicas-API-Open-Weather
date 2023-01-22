var req = new XMLHttpRequest();
var chave='31543fd642ee2a6f2bfb19c751903e38';//COLOQUE A CHAVE DA API AQUI ENTRE ASPAS SIMPLES
var pesquisar = document.querySelector("#pesquisar");

document.addEventListener('keypress',function(e){
    if(e.key == 'Enter')
    pesquisar.click();
})

pesquisar.onclick = function(){
    req.onloadend = function () {
        resp = req.responseText;
        resp_obj = JSON.parse(resp);
        if(resp_obj.cod==404){
            alert('Cidade Não Encontrada')
            return;
        }
        var temperatura = Math.trunc(resp_obj.main.temp);
        
        document.querySelector(".tempAtual").textContent= temperatura + '°';
        temperatura=calculaCor(temperatura);
        document.body.style.backgroundColor='hsl('+temperatura+',80%,50%)';

        document.querySelectorAll('.numero')[0].textContent=Math.trunc(resp_obj.main.temp_max) + '°';
        temperatura=calculaCor(Math.trunc(resp_obj.main.temp_max));
        document.querySelectorAll('.circulo')[0].style.border='10px solid hsl('+temperatura+',80%,50%)';

        document.querySelectorAll('.numero')[1].textContent=Math.trunc(resp_obj.main.temp_min) + '°';
        temperatura=calculaCor(Math.trunc(resp_obj.main.temp_min));
        document.querySelectorAll('.circulo')[1].style.border='10px solid hsl('+temperatura+',80%,50%)';

        document.querySelectorAll('.numero')[2].textContent=Math.trunc(resp_obj.main.humidity) + '%'
        document.querySelectorAll('.circulo')[2].style.border='10px solid hsl(180,80%,50%)';
        var icone = 'http://openweathermap.org/img/wn/'+ resp_obj.weather[0].icon+'@2x.png';
        document.querySelector('#img').src=icone;
        document.querySelectorAll('.nomeClima')[0].textContent=resp_obj.weather[0].description;
        document.querySelector('#nomeCidade').textContent=resp_obj.name+'('+resp_obj.sys.country+')';
        var latitude =resp_obj.coord.lat;
        var longitude =resp_obj.coord.lon;
        document.querySelector('#latitude').textContent='Latitude:'+latitude;
        document.querySelector('#longitude').textContent='Longitude:'+longitude;
        document.querySelector('#vento').textContent='Velocidade do Vento:'+Math.trunc(resp_obj.wind.speed) *3.6+'Km/h';
        
       var data=new Date(resp_obj.sys.sunrise*1000);
      var horario=transformaHora(data,resp_obj);
        document.querySelector('#nascer').textContent='Nascer do sol:'+horario;
        
        data= new Date(resp_obj.sys.sunset*1000);
        horario=transformaHora(data,resp_obj);
        document.querySelector('#por').textContent='Por do sol:'+horario;
        
        var distancia=calculaDistancia(latitude,longitude);
        document.querySelector('#distancia').textContent='Distancia até Brasilia:'+Math.trunc(distancia)+'Km';

        adicionarHistorico(resp_obj.name,Math.trunc(resp_obj.main.temp));
        mostrarInfos();
    }
    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q='+ document.querySelector("#cidade").value +'&lang=pt_br&units=metric&appid='+chave);
    req.send(null);
}




botaoHistorico.onclick=function(){
   var tabela=document.querySelector('#tabela');
    var thead=document.createElement('thead');
    var tbody=document.createElement('tbody');

    limpa();
    if(document.querySelector('#tituloTabela').textContent=='HISTORICO VAZIO'&&localStorage.length!=0){
        var nomeColunas=['Cidade','Data','Hora','Temperatura'];

        var cabecalho=document.createElement('tr');
        for(var j =0; j<nomeColunas.length;j++){
            var th=document.createElement('th');
            th.textContent=nomeColunas[j];
            cabecalho.appendChild(th);
        }
        thead.appendChild(cabecalho);

      var  c=JSON.parse(localStorage['cidade']);
       var d=JSON.parse(localStorage['data']);
       var h=JSON.parse(localStorage['hora']);
        var t=JSON.parse(localStorage['temperatura'])
       
        for(var i=0;i<c.length;i++){

            var linha=document.createElement('tr');
            
                
                var cel= criaCelula('td',c[i]);
                linha.appendChild(cel);
                cel= criaCelula('td',d[i]);
                linha.appendChild(cel);
                 cel= criaCelula('td',h[i]);
                linha.appendChild(cel);
                 cel= criaCelula('td',t[i]);
                linha.appendChild(cel);
                tbody.appendChild(linha);
        }


        tabela.appendChild(thead);
        tabela.appendChild(tbody);

        document.querySelector('#tituloTabela').textContent='HISTORICO DE PESQUISA'
    }
    document.querySelectorAll('.pesquisa')[0].style.display='none';
    document.querySelector('#historico').style.display='block';

}


function criaCelula(elemento,texto){
    elemento=document.createElement(elemento);
    elemento.textContent=texto;
    return elemento;
}

lixeira.onclick=function(){
            
    if(confirm('Deseja realmente apagar o historico?')==true){
        var tabela=document.querySelector('#tabela');
        tabela.innerHTML="";
        document.querySelector('#tituloTabela').textContent='HISTORICO VAZIO';
        alert('Historico Esvaziado com sucesso');
        localStorage.clear();
    }else
    alert('O historico não foi apagado');
}


fecharHistorico.onclick=function(){
    document.querySelectorAll('.pesquisa')[0].style.display='block';
    document.querySelector('#historico').style.display='none';
}

limpar.onclick= function(){
    limpa();
}

function limpa(){
    var largura = window.innerWidth;
    if(largura>595){
    document.querySelector('#infos').style.display='none';
    document.querySelector('#temperatura').style.display='none';
    document.querySelector('#nomeCidade').style.display='none';
    document.body.style.backgroundColor='white';
    document.querySelector('#cidade').value='Ex: Belo Horizonte';
    document.querySelectorAll('.pesquisa')[0].style.left ='0px';
    document.querySelectorAll('.pesquisa')[0].style.right='0px';
    document.querySelector('#divAjuda').style.display='none';
    }else{
        document.querySelector('#infos').style.display='none';
        document.querySelector('#temperatura').style.display='none';
        document.querySelector('#nomeCidade').style.display='none';
        document.body.style.backgroundColor='white';
        document.querySelector('#cidade').value='Ex: Belo Horizonte';
        document.querySelector('#divAjuda').style.display='none';
    }
}

ajuda.onclick=function(){
    var largura = window.innerWidth;

    if(largura>595){
    document.querySelectorAll('.pesquisa')[0].style.left ='auto';
    document.querySelectorAll('.pesquisa')[0].style.right='auto';
    document.querySelector('#divAjuda').style.display='block';
    }else{
        document.querySelector('#divAjuda').style.display='block';
    }
}

fechar.onclick=function(){
    document.querySelector('#divAjuda').style.display='none';
}

function calculaCor(temp){
   
    temp=parseInt(temp);
    if(temp==0){
        temp=240;
    }
     if(temp<0){
        temp=180;
    }else if(temp>40){
       temp=360;
    }else{
        temp=(120*temp/40)+240;
    }
    return temp;
}

function mostrarInfos(){
    var largura = window.innerWidth;
    if(largura>595){
    document.querySelectorAll('.pesquisa')[0].style.left ='auto';
    document.querySelectorAll('.pesquisa')[0].style.right='auto';
    document.querySelector('#infos').style.display='block';
    document.querySelector('#temperatura').style.display='block';
    document.querySelector('#nomeCidade').style.display='inline-block';
    }else{
        document.querySelector('#infos').style.display='block';
        document.querySelector('#temperatura').style.display='block';
        document.querySelector('#nomeCidade').style.display='inline-block';
    }

}
function transformaHora(data,resp_obj){
    var hora=data.getUTCHours()*3600;
    var minuto=data.getUTCMinutes()*60;
   
    var segundos=hora+minuto+resp_obj.timezone;
    
    var date=new Date(null);
    date.setSeconds(segundos);
    return date.toISOString().substr(11,5);
    
  }

  function calculaDistancia(latitude,longitude){

    var R = 6371;// KM
    var lat1 = -15.7797; // latitude de Brasilia
    var lat2 = latitude;         // latitude da cidade pesquisada
    var lon1 = -47.9297; // longitude de Brasilia
    var lon2 = longitude;         // longitude da cidade pesquisada
    var lat1radians = toRadians(lat1);
    var lat2radians = toRadians(lat2);
 
    var latRadians = toRadians(lat2-lat1);
    var lonRadians = toRadians(lon2-lon1);
 
    var a = Math.sin(latRadians/2) * Math.sin(latRadians/2) +
         Math.cos(lat1radians) * Math.cos(lat2radians) *
         Math.sin(lonRadians/2) * Math.sin(lonRadians/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 
    var d = R * c;
 
    return d;

  }


  function toRadians(val){
    var PI = 3.1415926535;
    return val / 180.0 * PI;
}

function adicionarHistorico(nCidade,temp){
var c;
var d;
var h;
var t;
data=new Date();
var hora=String(data.getHours()).padStart(2,'0')+':'+String(data.getMinutes()).padStart(2,'0');
var dat=String(data.getDate()).padStart(2, '0')+'/'+String(data.getMonth() + 1).padStart(2, '0')+'/'+data.getFullYear();
if(localStorage.length==0){
localStorage['cidade']=JSON.stringify([nCidade]);
localStorage['data']=JSON.stringify([dat]);
localStorage['hora']=JSON.stringify([hora]);
localStorage['temperatura']=JSON.stringify([temp]);
}else{
 c=JSON.parse(localStorage['cidade']);
 d=JSON.parse(localStorage['data']);
 h=JSON.parse(localStorage['hora']);
 t=JSON.parse(localStorage['temperatura']);

c[c.length]=nCidade;
d[d.length]=dat;
h[h.length]=hora;
t[t.length]=temp;

if(document.querySelector('#tituloTabela').textContent!='HISTORICO VAZIO'){
    var tabela=document.querySelector('#tabela');
    
    var tbody=tabela.getElementsByTagName('tbody')[0];

    var linha=document.createElement('tr');
    var cel= criaCelula('td',c[c.length-1]);
    linha.appendChild(cel);
    cel= criaCelula('td',d[d.length-1]);
    linha.appendChild(cel);
     cel= criaCelula('td',h[h.length-1]);
    linha.appendChild(cel);
     cel= criaCelula('td',t[t.length-1]);
    linha.appendChild(cel);
    tbody.appendChild(linha);

    tbody.appendChild(linha)
    tabela.appendChild(tbody);

}

localStorage['cidade']=JSON.stringify(c);
localStorage['data']=JSON.stringify(d);
localStorage['hora']=JSON.stringify(h);
localStorage['temperatura']=JSON.stringify(t);
}

}


window.addEventListener('resize', function () {
    
    var largura = window.innerWidth;

    if (largura <= 595) {
        document.querySelectorAll('.pesquisa')[0].style.left ='0px';
        document.querySelectorAll('.pesquisa')[0].style.right='0px';
    }else{
        var temp=document.querySelector('#temperatura').style.display;
        var ajuda=document.querySelector('#divAjuda').style.display;
        if(temp=='block' || ajuda=='block' ){
        document.querySelectorAll('.pesquisa')[0].style.left ='auto';
        document.querySelectorAll('.pesquisa')[0].style.right='auto';
        }else{
            document.querySelectorAll('.pesquisa')[0].style.left ='0px';
            document.querySelectorAll('.pesquisa')[0].style.right='0px'; 
        }
    }
        
});