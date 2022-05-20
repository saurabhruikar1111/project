console.log('very goodafternoon')
const availableRatios = new Set()

const Default = new Set(['currentPrice','pegRatio','debtToEquity','ebitdaMargins','revenueGrowth'])
const oposite = new Set( ['debtToEquity','currentPrice'])
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

            response = await axios.get('/f', {
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

/////  suplementry functions ///////////////////
////////////////////////////////////////////////////////////  

const screener = (ref)=>{
dic = {}
for(obj in ref){
    if (Default.has(obj)){
        dic[obj] = ref[obj] 
    }
}
return dic
}


let leftStock;
let rightStock;
const OnStockSelect = async (symbol, stock, summaryElement,side) => {
    const res = await axios.get('/search', {
        params: {
            sym: symbol
        }
    })
    //console.log(res.data)
    //summaryElement.innerHTML = stocktemplate3(res.data, stock)
    data =  screener(res.data)
    summaryElement.innerHTML = naming(stock,data,side)

    if(side==='left'){
        leftStock=res.data;
        
    }else{
        rightStock=res.data;
    }

    if(leftStock&&rightStock){
        const ratioOptions=document.querySelector('.btns')
        ratioOptions.classList.remove('is-hidden')
        ratioOptions.addEventListener('change',testfunc)

        
        
        const btnDivId=document.getElementById('btnDivId');
        btnDivId.classList.remove('is-hidden');
        const btn =document.getElementById('btn');
        const btn2 =document.getElementById('btn2');
        btn.addEventListener('click',runComparison);
        btn2.addEventListener('click',clear);
    }
};




const testfunc = (event)=>{
    const ratio = event.target.value
    if (!availableRatios.has(ratio)){
    leftdic={}
    rightdic={}
    leftdic[ratio]=leftStock[ratio]
    stocktemplate3(leftdic,document.querySelector('#left-summary'))
    rightdic[ratio]=rightStock[ratio]
    stocktemplate3(rightdic,document.querySelector('#right-summary'))
    }
    
}

const runComparison1= ()=>{
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


// const stocktemplate3 = (stockdata, stockname) => {
//     //console.log("in the third template")
//     const articleMain = document.createElement('article');
//     const articleSubMain = document.createElement('article');
//     articleSubMain.innerHTML = ` <p class='notification is-danger is-light is-size-4' >  ${stockname} </p>`
//     //console.log(stockdata);
//     articleMain.appendChild(articleSubMain);
//     for (const obj in stockdata) {
//         if (typeof (stockdata[obj]) == 'number') {
//             console.log('in if statement')
//             stockdata[obj] = stockdata[obj].toFixed(2);
//         }
//         const articleSubMain = document.createElement('article');
//         articleSubMain.className = 'notification is-primary';
//         articleSubMain.innerHTML = `<p class='title'>  ${stockdata[obj]} </p>
//         <p class='subtitle'>  ${obj} </p>`
//         const floatValue=parseFloat(stockdata[obj]);
//         articleSubMain.setAttribute('data-value', `${floatValue}`);
//         //adding class identity to identify these articlesubmain tab
//         articleSubMain.classList.add('identity')
        
//         articleMain.appendChild(articleSubMain);
//     }
//     //console.log(stockdata);
//     return articleMain.innerHTML;

// } 




const stocktemplate3 = (stockdata,articleMain) => {
    // const articleMain = document.createElement('article');
    // const articleSubMain = document.createElement('article');
    // articleSubMain.innerHTML = ` <p class='notification is-danger is-light is-size-4' >  ${stockname} </p>`
    
    // articleMain.appendChild(articleSubMain);
    for (const obj in stockdata) {
        availableRatios.add(obj)
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
        //adding class identity to identify these articlesubmain tab
        articleSubMain.classList.add('identity')
        
        articleMain.appendChild(articleSubMain);
    }
    //console.log(stockdata);
    //return articleMain.innerHTML;

} 




const runComparison = () => {
    //console.log('in runncomparision method')
    // if (document.querySelector('#btnDivId').contains('is-hidden')){
    //     document.querySelector('#btnDivId').remove('is-hidden')
    // }
    const leftsideStat = document.querySelectorAll('#left-summary .identity')
    const rightsideStat = document.querySelectorAll('#right-summary .identity')
    //console.log(leftsideStat)
    
    leftsideStat.forEach( (leftside,index)=>{
        const rightside = rightsideStat[index]

        const left = leftside.dataset.value
        const right = rightside.dataset.value

        
        const rationame = leftside.querySelector('.subtitle').innerText 
        //console.log(subtitle)
         if (!isNaN(left) &&  !isNaN(right) ){
            const left1 = parseFloat(left)
            const right1 = parseFloat(right)
            console.log(left1,right1)
            if (!oposite.has(rationame)){
                if (left1<right1){
                    leftside.classList.remove('is-primary')
                    leftside.classList.add('is-warning')
                }
                else {
                    rightside.classList.remove('is-primary')
                    rightside.classList.add('is-warning')
                }
            }
            
            else {
                if (right1>left1) {
                    rightside.classList.remove('is-primary')
                    rightside.classList.add('is-warning')
                }

                else {
                    leftside.classList.remove('is-primary')
                    leftside.classList.add('is-warning')
                }
            }
                
                
                
            
        
        }// first if ends here
        else {
            console.log('in dark else ')
            if (isNaN(left)){
                leftside.classList.remove('is-primary')
                leftside.classList.add('is-dark')
            }
            
            if (isNaN(right)){
                rightside.classList.remove('is-primary')
                rightside.classList.add('is-dark')
            }
        }

        // here leftside and rightside are dom elements while left right are just numbers
    }  )
    
}

const clear = () => {
    const left = document.querySelectorAll('#left-summary .identity')
    const right = document.querySelectorAll('#right-summary .identity')
    if (left){
        helperClear(left)
    }

    if (right){
        helperClear(right)
    }
} 

const naming = (stockname,stockdata,side)=> {
    const articleMain = document.createElement('article');
    console.log(side)
    if (side === 'left'){
        console.log('adding class to article')
        articleMain.classList.add('l')
    }
    else {
        articleMain.classList.add('class-right')
    }
    const articleSubMain = document.createElement('article');
    articleSubMain.innerHTML = ` <p class='notification is-danger is-light' >  ${stockname} </p>`
    
    articleMain.appendChild(articleSubMain);
    stocktemplate3(stockdata,articleMain)
    return articleMain.innerHTML


}    

const helperClear = (el) => {
    console.log(el)
    
    el.forEach((subel) =>{
        if (subel.classList.contains('is-dark')) {
        
            subel.classList.remove('is-dark')
            subel.classList.add('is-primary')
        
        }
    
        if (subel.classList.contains('is-warning')) {
            
            subel.classList.remove('is-warning')
            subel.classList.add('is-primary')
        
        }
    } )
    
    
    
        
    
}

// stocktemplate3 purpose: create comparative elements in primary-color and return html 