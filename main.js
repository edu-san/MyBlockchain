//Se necesita la libreria crypto.js, que la instalamos asi:npm install --save crypto.js
//Luego la importamos como se muestra a continuacion
import { SHA256 as _SHA256 } from "crypto-js/sha256";

class Block{
    constructor(index,timestamp,data,PreviousHash =''){
        //PreviousHash se utiliza para validar la cadena de bloques
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.PreviousHash = PreviousHash;
        this.hash = this.crearHash();
    }

    crearHash(){
        return _SHA256(this.index + this.PreviousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.cadena = [this.crearBlockGenesis()];
    }

    crearBlockGenesis(){
        return new Block(0,"2018/03/01","Block Genesis","0");
    }

    ultimoBlock(){
        return this.cadena[this.cadena.length - 1];
    }

    agregarBlock(nuevoBlock){
        nuevoBlock.PreviousHash = this.ultimoBlock().hash;
        nuevoBlock.hash = nuevoBlock.crearHash();
        this.cadena.push(nuevoBlock);
    }
}

var myBC = new BlockChain();
myBC.agregarBlock(new Block(1,"2018/04/01",{ cantidad: 5}));
myBC.agregarBlock(new Block(2,"2018/04/05",{ cantidad: 10}));

console.log(JSON.stringify(myBC,null,4));






