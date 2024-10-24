console.log("inne")
document.addEventListener("DOMContentLoaded", () =>{
    
    // async function fetchingAllMedias() {
    //         const response = await fetch('media.json')
    //         const data = await await response.json;
    //         return data;
    //         console.log(data);
    //     }
        

    //har fått mycket hjälp med denna function av en bekant webbkunnig, men grunden hittades här: https://www.geeksforgeeks.org/read-json-file-using-javascript/ , tycker att jag förstår den mesta koden trots mycket hjälp.
    // https://oxylabs.io/blog/javascript-read-json-file

function fetchingAllMedia(){ 
        return fetch('media.json') //hämtar och returnerar jsonfilens data, lade till return för att det krävdes ett promise för att kunna använda denna i de andra metoderna

        .then((res) => { //vad ska hända om anropet lyckas, res är svaret response
            if (!res.ok) {  //res.ok inbyggd
                throw new Error //något fel med anropet
                (`HTTP error! Status: ${res.status}`);
            }
            return res.json(); //konverteras till jsonformat för att kunna returnera ett promise ==> använda resultatet i annan .then()
        })

        .then((dataFromJson) =>{ //tar emot json datat. data= parameter som representerar innehållet fårn json
            if (dataFromJson && dataFromJson.data) { //dataFromJson.data är ju alltså arrayen där all info om filmerna och serierna finns i jsonfilen som heter data.
                
                        console.log(dataFromJson.data)
                        return dataFromJson.data    //returnera data så att det kan användas sen 
                            
            }else{
            console.log("error")
                }
            })
            .catch((error) =>
            console.error("Unable to fetch data:", error));
                    
                    
    }
               
                

        

    function fetchGenres(){ 
        fetchingAllMedia().then(function(moviesAndSeries){ //om fetchingAllMEdia lyckas returneras all data till moviesandseries
            
            // const genreCount =[];
            let genres=[]; //komme rlagra alla UNIKA genrers 
            for (let i=0; i<moviesAndSeries.length; i++){  //går igenpm varje objekt i moviesAndSeries, varje varv blir item den filmen/serien, går sedan vidare för att undersöka genre
                let item =moviesAndSeries[i]; 
                
                
                for(let j=0; j<item.genres.length; j++){  //length efterson att varje film har flera genres https://stackoverflow.com/questions/73093024/i-want-to-display-genres-of-a-movie
                    let genre=item.genres[j].name //ger genre-listan genre-namnen, måste vara [j] för att det ska funka. Ger ett unikt objekts(j) genre namn
                    
                    if(!genres.includes(genre)){ //genre namnet läggs bara till om genren inte finns i genres-listan
                        genres.push(genre)

                        
                    }
                  

                }
            }
            
            //den här delen har jag fått hjälp med att komma fram till det här genreCounts[genre], men här läst mer om det här:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
            
            const genreCounts={}; //här kommer varje genre att finnas som egenskap samt hur många som finns/genre
            //let totalMovies=moviesandseries.length;

            for(let i =0; i < moviesAndSeries.length; i++){
                let item = moviesAndSeries[i];

                for (let j = 0; j < item.genres.length; j++) {  //går igenom varje genre som filmen har
                    const genre = item.genres[j].name;      //genre-namnet lagras

                    if (genreCounts[genre]) { //finns action i genreCounts
                        genreCounts[genre]++;  // JA Öka antalet för denna genre
                    } else {
                        genreCounts[genre] = 1;  // NEJ Skapa en genre för genren och sätt till 1
                    }
                    
                }
            }

            displayGenresWithProcent(genres, genreCounts, moviesAndSeries)
          console.log("Unika genrer:", genres);
               

        });
    }

    function displayGenresWithProcent(genres, genreCounts, moviesandseries){ 
        const filter = document.querySelector(".filter");   
        filter.innerHTML ="";
        const totalMovies=moviesandseries.length

        for (const genre of genres){ //för varje genre i genres(från fetchGenres), hjälp från funktionen genrateDishes från FL2     
            const count=genreCounts[genre] //hur många filmer har action som genre
            const percentage= (count/totalMovies)*100; //matten
          
            
            const genreMeter = document.createElement("meter");
            genreMeter.classList.add("genre-meter")
            genreMeter.value=percentage;
            genreMeter.max =100;    //https://www.w3schools.com/tags/att_meter_max.asp
            genreMeter.textContent=(`${genre} - ${percentage}%`); 
            genreMeter.setAttribute("data-genre", genre) //sätter attributet till genre värdet
            //setAttribute fick jag som tips för att få klick-eventet nedan att fungera enkelt!

            const genreLabel= document.createElement("span")
            genreLabel.classList.add("genre-label")
            genreLabel.textContent=(`${genre} - ${percentage}%`); //Action-50%
            
            const meterAndTextDiv = document.createElement("div");

            meterAndTextDiv.classList.add("meter-and-text-div");
            meterAndTextDiv.appendChild(genreLabel);  
            meterAndTextDiv.appendChild(genreMeter); 

            //console.log(`${genre} - ${percentage}%`)
            filter.appendChild(meterAndTextDiv);

            genreMeter.addEventListener("click", function(){        //https://www.shecodes.io/athena/102-adding-an-event-listener-to-a-button-click-in-javascript
                const selectedMeter = genreMeter.getAttribute("data-genre") //hämtar genren och kan på så sätt få filterMoviesByGenre att fungera
                filterMoviesByGenre(selectedMeter, moviesandseries) //hämtar genren på valda metern och alla filmer och serier
            });

        }
    }

    // function filterMoviesByGenre(selectedMeter, moviesandseries){
    //     const reviews = document.querySelector(".reviews")
    //     reviews.innerHTML="";   //tömmer reviews delen för att kunna visa bara genre filmer

    //     let filtered = moviesandseries.filter(ms => ms.genre==selectedMeter)
    //     console.log(filtered)
    // }

    function filterMoviesByGenre(selectedMeter, moviesandseries){
        const reviews = document.querySelector(".reviews")
        reviews.innerHTML="";   //tömmer reviews delen för att kunna visa bara genre filmer
        
        

        const arrowDiv = document.createElement("div"); //bakåt-pil
        arrowDiv.classList.add("arrow-div")
        const backArrow = document.createElement("img")
        backArrow.classList.add("arrow-pic")
        backArrow.src = "arrow.png"
        arrowDiv.appendChild(backArrow)
        reviews.appendChild(arrowDiv)


        for (let i = 0; i < moviesandseries.length; i++) { 
            let item = moviesandseries[i];
            let hasGenre; // En sant eller falskt
            let genreName=[];
            
            for (let j = 0; j < item.genres.length; j++) {
                hasGenre=false;    //måste sätta till falskt annars funkar det inte sen
                
                if(item.genres[j].name ==selectedMeter){ //om filmens genre stämmer överens med den valda meterns genre
                    genreName=item.genres[j].name //enda sättet jag fick till att visa genrenamnet i metern
                    hasGenre=true;
                    break; //om rätt genre hittas slutar loopen att kolla, utan break fortsätter den bara och inga filmer syns
                    
                }                
            }
           
            
            if (hasGenre) { //för de filmer som har rätt genre målas de upp
                
                const mediaContainer = document.createElement("div");
                const mediaPic = document.createElement("img")
                mediaPic.classList.add("media-pic")
                mediaPic.src = "https://image.tmdb.org/t/p/w500" + item.poster_path;
                const starDiv= document.createElement("div");
               

                

                displayOneMeter(genreName);

              
                for (let j = 0; j <item.cmdb_score; j++) { 
                    const star = document.createElement("img")
                    star.classList.add("star")
                    star.src ="star.png"
                    starDiv.appendChild(star)

                }
                
                mediaContainer.appendChild(mediaPic)
                mediaContainer.appendChild(starDiv)
                reviews.appendChild(mediaContainer);
               

               
                    
               // const title= document.querySelector(".review-title")
                // title.textContent(`${item.genre.name}`)
               // reviews.appendChild(title)
               
               
               //gjorde som i mina averageScoreCount och displayMoviesAndSeries funktioner efter att inte få till att anropa dem direkt här hur jag än gjorde.

                
                let scores = [] 

 
                if(item.cmdb_score){    
                    scores.push(item.cmdb_score)
                    }
                     
                if (scores.length>0){ 
                    let total =0;
                    for(let i=0; i<scores.length;i++){  
                        total+= scores[i];  
                    }
                       
     
                     
                    let averageScore=(total/scores.length) //matten
                    console.log(averageScore)
                    displayPoppe(averageScore); //ska visas i poppe
                    }

               
             
                

                let movies =[]
                let series=[]
                  
                if(item.media_type=="Movie"){
                   movies.push(item.name)// lägg till film om media_type==film
                }
               else{
                     series.push(item.name) //annars lägg till i serie
                }
                    
                displayMoviesAndSeries(movies, series)
                    
               
                
                   
   




              
                    
            }
           
            
            arrowDiv.addEventListener("click", function(){
            
                location.reload() // fick inte till att bara "gå tillbaka"
                // displayAllMedia(); 
                // fetchGenres()   //dessa gjorde konsollen överfull
                // displayGenresWithProcent()
                
              
            });

        }
        
        
        

    }

    function displayOneMeter(name){
        const filter = document.querySelector(".filter")
        filter.innerHTML="";
      
       

        const genreMeter = document.createElement("meter");
        genreMeter.classList.add("genre-meter")
        genreMeter.value=50;
        genreMeter.max =100;  
        
        const genreLabel= document.createElement("span")
        genreLabel.classList.add("genre-label")
        genreLabel.textContent=(name);

      const meterAndTextDiv=document.createElement("div")
        meterAndTextDiv.classList.add("meter-and-text-div");
        meterAndTextDiv.appendChild(genreLabel);  
        meterAndTextDiv.appendChild(genreMeter); 
       
        filter.appendChild(meterAndTextDiv)
    }

    function averageScoreCount(moviesandseries){ //https://jrsinclair.com/articles/2019/five-ways-to-average-with-js-reduce/ 
        //fetchingAllMedia().then(function(moviesandseries){
            let scores = [] //sparar varje poäng som satts, alltså 5 3 4 4, inte hur många som har satt poäng=4

            for (let i = 0; i < moviesandseries.length; i++) {
                let item = moviesandseries[i];

                if(item.cmdb_score){    // om en film eller serie har cmdb_score => lägg till i score array
                    scores.push(item.cmdb_score)
                }
                
                
            }

            if (scores.length>0){ //fins några poäng
                let total =0;
                for(let i=0; i<scores.length;i++){  //går igenom alla filmer från scroes, 
                    total+= scores[i];  //total= totala antalet poäng alltså 5+4+3 inte 1+2+3
                  
                }

                
                let averageScore=(total/scores.length) //matten
                console.log(averageScore)
                displayPoppe(averageScore); //ska visas i poppe
            }
        //})
    }

    function seperateMoviesAndSeries(moviesandseries){
        //fetchingAllMedia().then(function(moviesandseries){
            let movies=[]   //ska skapara alla filmer
            let series=[]   //ska spara alla serier
            for (let i = 0; i < moviesandseries.length; i++) {
                let item = moviesandseries[i];
                if(item.media_type=="Movie"){
                    movies.push(item.name)// lägg till film om media_type==film
                }
                else{
                    series.push(item.name) //annars lägg till i serie
                }
                
                
            }
            console.log("Serier:", series);
            console.log("Filmer:", movies);
            displayMoviesAndSeries(movies, series) //för film/serie bilden
        //});
    }


   function displayMoviesAndSeries(movies, series){
    const movieOrShow = document.querySelector(".movie-or-show");
        movieOrShow.innerHTML ="";

        if(movies){
            const moivePic = document.createElement("img")
            moivePic.classList.add("movieandseries-pic")
            moivePic.src="camera.png"
            movieOrShow.appendChild(moivePic)

            const movieSpan= document.createElement("span")
            movieSpan.classList.add("movie-span")
            movieSpan.textContent= movies.length //texten visar hur många filmer som finns i movies och därmed i json-filen
            
            const moviePicAndText = document.createElement("article")
           moviePicAndText.classList.add("movie-pic-and-text")
            
          moviePicAndText.appendChild(moivePic)
           moviePicAndText.appendChild(movieSpan)
            
            movieOrShow.appendChild(moviePicAndText)
           
            console.log("antal filmer", movies.length)

        }
        if(series){
            const seriesPic = document.createElement("img")
            seriesPic.classList.add("movieandseries-pic")
            seriesPic.src="tv.png"
           
            
            const seriesSpan= document.createElement("span")
            seriesSpan.classList.add("series-span")
            seriesSpan.textContent= series.length
            
            const seriesPicAndText = document.createElement("article")
            seriesPicAndText.classList.add("series-pic-and-text")
            
            seriesPicAndText.appendChild(seriesPic)
            seriesPicAndText.appendChild(seriesSpan)
            
            movieOrShow.appendChild(seriesPicAndText)
            
            console.log("antal serier", series.length)
        }

   }

    

    function displayPoppe(averageScore){ //tar emot poängen för att kunna visa den 
        const statistics = document.querySelector(".poppe");
        statistics.innerHTML ="";

        const poppePic= document.createElement("img")
        poppePic.classList.add("poppe-pics")                                       
        const averageScoreSpan= document.createElement("span")
        averageScoreSpan.textContent=(averageScore);
        averageScoreSpan.classList.add("average-score-span")

        const poppeAndScoreArticle = document.createElement("article");
        poppeAndScoreArticle.classList.add("poppe-and-score-article");

        poppeAndScoreArticle.appendChild(averageScoreSpan);  
        poppeAndScoreArticle.appendChild(poppePic); 
        statistics.appendChild(poppeAndScoreArticle)


             if (averageScore<0) { // beroende på poäng visas olika poppe
                 
                  poppePic.src="poppe0.png"
                
                    
                }
            else if (averageScore<=1 && averageScore>0) {
           
                    poppePic.src="poppe1.png"
                   
                }
            else if (averageScore<=2 && averageScore>1) {
                 
                    poppePic.src="poppe2.png"
                   
                }
            else if (averageScore<=3 && averageScore>2) {
                    
                    poppePic.src="poppe3.png"
                    
                }
            else if (averageScore<=4 && averageScore>3) {
                   
                    poppePic.src="poppe4.png"
                    
                }
            else if (averageScore>4) {
                    poppePic.src="poppe5.png"

                    //statistics.appendChild(averageScoreLabel); 
                }
                

    }

    function displayAllMedia(){ //ska visa alla filmer/serier på sidan
        fetchingAllMedia().then(function(moviesandseries){ 

         const reviews = document.querySelector(".reviews");
            reviews.innerHTML ="";

         

            for (let i = 0; i < moviesandseries.length; i++) {
                let media=moviesandseries[i]; //en media=en film/serie

                const mediaContainer= document.createElement("div")     //skapar ett element för varje film
                mediaContainer.classList.add("media-container")
               
                //https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
                const mediaPic = document.createElement("img")
                mediaPic.classList.add("media-pic")
                mediaPic.src = "https://image.tmdb.org/t/p/w500" + media.poster_path;
                mediaContainer.appendChild(mediaPic) //måste ha appendchild för att det ska synas i gränssnittet sen
                
                const starDiv = document.createElement("div")
                starDiv.classList.add("star-div")

                for (let j = 0; j <media.cmdb_score; j++) { //Helt ärligt förstår jag inte riktigt hur detta kan bli rätt, men provade mig fram och item.cmdb_score vad det som funkade. Tänker att alla bara borde ha en stjärna för en film har ett score.
                    const star = document.createElement("img")
                    star.classList.add("star")
                    star.src ="star.png"
                    starDiv.appendChild(star)

                }

                mediaContainer.appendChild(starDiv)
                reviews.appendChild(mediaContainer)
                
            }
            
            seperateMoviesAndSeries(moviesandseries)
            averageScoreCount(moviesandseries)
            fetchGenres();
        })
    }
    

    
    displayAllMedia();
    
   // seperateMoviesAndSeries();
   // averageScoreCount();

 
    

   

}); 