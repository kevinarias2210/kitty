const URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const URL_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}&api_key=live_NVcOghLim9ibaGKu8ruri9fystMe0bxps4iusECcbezNDfZQE50D0WCmoHLF6dPs`
const URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

/*Nosotros podemos acceder a ciertas paginas y darle cierta limitaciones que 
nosotros querramos que nos muestre, para ello necesitamos colocar un signo de 
interrogarción (?) junto con el link del servidor: search?limit=10&page=2.
Esto nos dice que nos muestre 10 cosas de la pagina 2, ahora no podemos 
haceder cierta información de la API, para esto se necesita un API_KEY que 
nos da el acceso*/

const error = document.getElementById('error');

const btn = document.querySelector('#btn');

async function fetchData(){
    const res = await fetch(URL_RANDOM);
    const data = await res.json();
    
    console.log("random");
    console.log(data);

/*Colocamos este condicional para mostrar un error de HTTP Status code 
de tipo 500 a los usuarios, ya que al momento de concectarse con el servidor 
del backend haya un error en el backend. */

    if(res.status !==200){
        error.innerHTML = "Hubo un error: " + res.status;
    }else{
        const imagen = document.querySelector('#img1');
        const imagen2 = document.querySelector('#img2');
        const btn_save1 = document.getElementById('btn_save1');
        const btn_save2 = document.getElementById('btn_save2');
        
        imagen.src = data[0].url;
        imagen2.src = data[1].url;
        
        btn_save1.onclick = () => saveFavorites(data[0].id);
        btn_save2.onclick = () => saveFavorites(data[1].id);
    }
    
    return data;
}

async function loadFavorite(){
    const res = await fetch(URL_FAVORITES, {
        method: 'GET',
        headers: {
            'x-api-key': 'live_NVcOghLim9ibaGKu8ruri9fystMe0bxps4iusECcbezNDfZQE50D0WCmoHLF6dPs'
        },

    });
    const data = await res.json();

    console.log("favorites");
    console.log(data);
    
    if(res.status !==200){
        error.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        /*Cuando se llamó esta función a las otras funciones, cada vez que
        se guardaba o se eliminaba se repetia la información, entonces antes
        de que se recorriera con el foreach limpiaba la seccion y ahí si se
        empezaba a crear gracias al foreach */
        const section = document.querySelector('.section__favorites');
        section.innerHTML= "";
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Gatos Favoritos');
        const imgPatita = document.createElement('img');
        div1.classList.add('section__favorites--h2');
        div1.appendChild(h2);
        div1.appendChild(imgPatita);
        h2.appendChild(h2Text);
        h2.classList.add('gatitos');
        imgPatita.classList.add('section__containerRandom--patita');
        imgPatita.setAttribute('src', './img/patita.png');
        section.appendChild(div1);

    
        data.forEach(kitty => {
        
        const article = document.createElement('article');
        const img = document.createElement('img');
        const boton = document.createElement('button');
        const btnText = document.createTextNode('Quitar imagen en favoritos');
        const imgDelete = document.createElement('img');

        img.src = kitty.image.url;
        img.classList.add('section__container--img');
        imgDelete.classList.add('section__favorites--deleteImg');
        imgDelete.setAttribute('src', './img/delete.png');

        boton.appendChild(btnText);
        boton.classList.add('section__favorites--delete');
        boton.onclick = () => deleteFavorite(kitty.id);
        boton.appendChild(imgDelete);

        article.appendChild(img);
        article.appendChild(boton);

        div2.classList.add('section__favorites--div');
        div2.appendChild(article);  
        section.appendChild(div2);
       });
    }

    return data;
}

/*Se crea una función asincrona para guardar el endpoint para mandar esa
información*/

async function saveFavorites(id){
    const res = await fetch(URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'live_NVcOghLim9ibaGKu8ruri9fystMe0bxps4iusECcbezNDfZQE50D0WCmoHLF6dPs'
        },
        body: JSON.stringify ({
            image_id: id
        })
    });

    const data = await res.json();

    console.log('guardar gatos');
    console.log(res);

    if(res.status !==200){
        error.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('gato guardado');
        loadFavorite();
    }

    return data;
}
/*En la condicional se llama la funcion donde se cargan las imagenes guardadas
para que se precione el boton de guardar o eliminar para que carguen sin tener
que actualizar la pagina*/

async function deleteFavorite(id){
    const res = await fetch(URL_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': 'live_NVcOghLim9ibaGKu8ruri9fystMe0bxps4iusECcbezNDfZQE50D0WCmoHLF6dPs'
        }
    });

    const data = await res.json();

    if(res.status !==200){
        error.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('gato eliminado');
        loadFavorite();
    }
    
}

async function uploadGato(){
    const form = document.getElementById('uploading__form');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(URL_UPLOAD, {
        method: 'POST',
        headers:{
            'x-api-key': 'live_NVcOghLim9ibaGKu8ruri9fystMe0bxps4iusECcbezNDfZQE50D0WCmoHLF6dPs'
        },
        body: formData,
    });
    const data = await res.json();
    console.log(data);

    if(res.status !==201){
        error.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('foto de gato subida');
        /* console.log(data); */
        saveFavorites(data.id);
    }
}

btn.onclick = fetchData;

fetchData(URL_RANDOM);
loadFavorite(URL_FAVORITES);