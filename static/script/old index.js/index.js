console.log('very goodafternoon')
//alert('connection succesful')
// const el=document.createElement('input')
// document.body.appendChild(el)
// async function fetchdata(search) {
//     let response;
//     if(search!=''){

//             response = await axios.get('http://127.0.0.1:5000/',{
//             params:{
//                 stock_name:search
//             }

//         })
//         return response.data

//     }
//     return {}
//     // console.log(response.data)

// }


// const root = document.querySelector('.container')
// root.innerHTML = `
//     <label> <b> search for a stock </b> </label>
//     <input class = 'input' > 
//     <div class='dropdown'>  
//         <div class = 'dropdown-menu'>
//             <div class = 'dropdown-content results'>  </div>
//         </div>
//     </div>
// `
const autoCompleteConfig = {

    renderOption(stock) {
        return `
        <p>${stock}<p>
        `
    },



    inputValue(stock) {
        return stock
    },
    async fetchdata(search) {
        let response;
        if (search != '') {

            response = await axios.get('http://127.0.0.1:5000/f', {
                params: {
                    stock_name: search
                }

            })
            return response.data

        }
        return {}
        // console.log(response.data)

    }

}
createautocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionselect(stocks, stock) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        OnStockSelect(stocks, stock, document.querySelector('#left-summary'),'left')
    }
});

createautocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionselect(stocks, stock) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        OnStockSelect(stocks, stock, document.querySelector('#right-summary'),'right')
    }
});


// const input = document.querySelector('input');
// // const maindiv =document.querySelector('#target')
// const dropdown = document.querySelector('.dropdown');
// const resultWrapper = document.querySelector('.results');






// const oninput = async event =>{
//     const stocks=await fetchdata(event.target.value)
//     if(Object.keys(stocks).length==0){
//         dropdown.classList.remove('is-active')
//         return
//     }

//     dropdown.classList.add('is-active');
//     resultWrapper.innerHTML=''
//     console.log(stocks)

//     for (let stock in stocks){
//         const option = document.createElement( 'a')
//         option.classList.add('.dropdown-item')
//         option.innerHTML = `
//         <p>${stock}<p>
//         `
//         option.addEventListener('click',()=>{
//             input.value = stock
//             dropdown.classList.remove('is-active')
//             console.log(stocks[stock],222)
//             OnStockSelect(stocks[stock],stock)
//         })

//         resultWrapper.appendChild(option)
//     }
// }

// input.addEventListener('input',debounce(oninput,500))
// document.addEventListener('click',event=>{
//     if(!root.contains(event.target)){
//         dropdown.classList.remove('is-active')
//     } 
// })

let leftStock;
let rightStock;
const OnStockSelect = async (symbol, stock, summaryElement,side) => {
    const res = await axios.get('http://127.0.0.1:5000/search', {
        params: {
            sym: symbol
        }
    })
    console.log(res.data)
    summaryElement.innerHTML = stocktemplate3(res.data, stock)

    if(side==='left'){
        leftStock=res.data;
    }else{
        rightStock=res.data;
    }

    if(leftStock&&rightStock){
        const btnDivId=document.getElementById('btnDivId');
        btnDivId.classList.remove('is-hidden');
        const btn =document.getElementById('btn');
        btn.addEventListener('click',runComparison);
    }
};

const runComparison= ()=>{
    const leftSideStats=document.querySelectorAll('#left-summary .is-primary');
    const rightSideStats=document.querySelectorAll('#right-summary .is-primary')

    leftSideStats.forEach((leftStat,index)=>{
        const rightStat=rightSideStats[index];
        
        const leftSideValue=parseFloat(leftStat.dataset.value);
        const rightSideValue=parseFloat(rightStat.dataset.value);

        if(rightSideValue>leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning')  
        }
        else if(leftSideValue>rightSideValue ){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');  
        }
        else if((isNaN(rightSideValue)) && ((!isNaN(leftSideValue))) ) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-dark');
        }
        else if((isNaN(leftSideValue)) && ((!isNaN(rightSideValue))) ){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-dark');  
        }
        else{
            leftStat.classList.remove('is-primary');
            rightStat.classList.remove('is-primary');
            leftStat.classList.add('is-dark');
            rightStat.classList.add('is-dark');    
        }
    })
    
};

// const stocktemplate = stockdata => {
//     console.log(stockdata.currentPrice)
//     const { currentPrice, debtToEquity } = stockdata;
//     console.log(currentPrice, debtToEquity);
//     return `
        
//     <article >
//         <article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata.currentPrice} </p>
//         <p class='subtitle'>  currentprice </p>
//         </article>

//         <article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata.debtToEquity} </p>
//         <p class='subtitle'>  debtToEquity </p>
//         </article>

//         <article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata.ebitdaMargins} </p>
//         <p class='subtitle'>  ebitdaMargins </p>
//         </article>

//         <article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata.pegRatio} </p>
//         <p class='subtitle'>  pegRatio </p>
//         </article>

//         <article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata.revenueGrowth} </p>
//         <p class='subtitle'>  revenueGrowth </p>
//         </article>
//     </article>
    
//     `
// }

// const stocktemplate2 = (stockdata, stock) => {
//     console.log('in the second template')
//     const article = document.createElement('p')
//     const option = document.createElement('p')
//     option.innerHTML = `<figure class='media-left'>
//         <p class='notification is-success is-light is-size-4' >  ${stock} </p>                
//     </figure>`
//     console.log(stockdata)
//     article.appendChild(option)

//     //article.innerText='test string'
//     for (const obj in stockdata) {
//         if (typeof (stockdata[obj]) == 'number') {
//             console.log('in if statement')
//             stockdata[obj] = stockdata[obj].toFixed(2);
//         }
//         const option = document.createElement('p')
//         option.innerHTML = `<article class = 'notification is-primary'> 
//         <p class='title'>  ${stockdata[obj]} </p>
//         <p class='subtitle'>  ${obj} </p>
//         </article>`
//         article.appendChild(option)
//     }
//     console.log(stockdata)
//     return article.innerHTML
// }


const stocktemplate3 = (stockdata, stock) => {
    console.log("in the third template")
    const articleMain = document.createElement('article');
    const articleSubMain = document.createElement('article');
    articleSubMain.className = 'notification is-danger is-light size-4 ';
    articleSubMain.innerHTML = ` <p class='title companyname' >  ${stock} </p>`
    console.log(stockdata);
    articleMain.appendChild(articleSubMain);
    for (const obj in stockdata) {
        if (typeof (stockdata[obj]) == 'number') {
            console.log('in if statement')
            stockdata[obj] = stockdata[obj].toFixed(2);
        }
        const articleSubMain = document.createElement('article');
        articleSubMain.className = 'notification is-primary';
        articleSubMain.innerHTML = `<p class='title'>  ${stockdata[obj]} </p>
        <p class='subtitle'>  ${obj} </p>`
        const floatValue=parseFloat(stockdata[obj]);
        articleSubMain.setAttribute('data-value', `${floatValue}`);
        
        articleMain.appendChild(articleSubMain);
    }
    console.log(stockdata);
    return articleMain.innerHTML;

} 
