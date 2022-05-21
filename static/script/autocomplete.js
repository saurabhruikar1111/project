const createautocomplete = ({ root ,
    renderOption,
    onOptionselect,
    inputValue,
    fetchdata}) => {
console.log(root)    
//const root = document.querySelector('.container')
root.innerHTML = `
    <label> <b> Search For a Stock : </b> </label>
    <input class = 'input' placeholder="Enter the stock name" style="border-color:black;" > 
    <div class='dropdown'>  
        <div class = 'dropdown-menu '>
            <div class = 'dropdown-content results'> 
            </div>
        </div>
    </div>
`

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultWrapper = root.querySelector('.results');


const oninput = async event =>{
    const stocks=await fetchdata(event.target.value)
    // stocks is an object like {tata consultancy services:TCS} where key is name of stock
    // and value is symbol of that stock
    if(Object.keys(stocks).length==0){
        dropdown.classList.remove('is-active')
        return
    }
    
    dropdown.classList.add('is-active');
    resultWrapper.innerHTML=''
    console.log(stocks)
    
    for (let stock in stocks){
        const option = document.createElement( 'a')
        option.classList.add('.dropdown-item')
        option.innerHTML = renderOption(stock)
        option.addEventListener('click',()=>{
            input.value = inputValue(stock)
            dropdown.classList.remove('is-active')
            console.log(stocks[stock],222)
            //OnStockSelect(stocks[stock],stock)
            onOptionselect(stocks[stock],stock)
        })
        const hr=document.createElement('hr');
        hr.classList.add('dropdown-divider');
        option.appendChild(hr);
        
        resultWrapper.appendChild(option)
    }
 }

input.addEventListener('input',debounce(oninput,500))
document.addEventListener('click',event=>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')
    } 
})

// const OnStockSelect = async (symbol,stock) =>{
//     const res=await axios.get('http://127.0.0.1:5000/search', {
//         params:{
//             sym:symbol
//         }
//     } )
//     console.log(res.data)
//     document.querySelector('#summary').innerHTML=stocktemplate2(res.data,stock)
// }


}

























