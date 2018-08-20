/*
* @Author: zhangmingemma
* @Date:   2018-06-13 11:48:36
* @Last Modified by:   zhangmingemma
* @Last Modified time: 2018-06-13 11:49:33
*/
var result = document.getElementById("result");
var equation = '';
function compute(ev){
	if (/^[0-9]+.?[0-9]*$/.test(ev.target.innerText)) {
		handleNumber(ev.target.innerText);
	}else if (ev.target.innerText == '=') {
		handleEqual();
	}else if (ev.target.innerText == 'AC') {
		handleClear();
	}else if (ev.target.innerText == '.') {
		if (!(/\./.test(result.value))) {
			handleNumber(ev.target.innerText);
		}
	}else if (ev.target.innerText == '+/-') {
		handleChange();
	}else{
		handleTool(ev.target.innerText);
	}
}

function handleNumber(num){
	var str = result.value;
	str = str == '0'? "":str;
	str += num;
	result.value = str;
}

function handleTool(operation){
	equation += result.value + operation;
	result.value=0;
}

function handleEqual(){
	equation += result.value; 
	result.value = eval(equation);
	equation = '';
}

function handleClear(){
	result.value = 0;
	equation = '';
}

function handleChange(){
	var str = result.value;
	str = str[0] == '-'? str.slice(1):('-'+str);
	result.value = str;
}
