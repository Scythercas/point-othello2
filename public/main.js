window.onload = function(){

    /*
    メモ
        y座標は盤面の下にいくほど大きくなる
        x座標はふつう
    
        自分の背景色：colorArray[which]
        相手の背景色：colorArray[(which-1)*(-1)+1]
    
        コメントに関して
        //ゲームの処理など大事な部分に関する記述
        ////割とどうでも良い記述や予備知識
    */
        const kadoTsuyo = 
        [25,10,10,10,10,10,10,25,
        10,5,5,5,5,5,5,10,
        10,5,2,2,2,2,5,10,
        10,5,2,1,1,2,5,10,
        10,5,2,1,1,2,5,10,
        10,5,2,2,2,2,5,10,
        10,5,5,5,5,5,5,10,
        25,10,10,10,10,10,10,25];
    
        const field = document.getElementById("playField");
        const table = document.createElement("table");
        const finalResultDiv = document.getElementById("finalResult");
        const ans = new Array;
        let turn = 1;
    
        const colorArray = ["rgb(255, 32, 32)", "rgb(202, 255, 202)","rgb(16, 255, 16)","rgb(250,250,250)"];
        const toCell = (x,y) => {
            //x座標, y座標を引数に、それらを座標に持つセルを返す関数。
            return document.getElementById((10*x+y).toString(10));
        }
        const random = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max-min+1)+min);
        }
        const clickCell = (e) => {
        // 実質メイン関数
            if(e.target.style.backgroundColor==colorArray[0]||e.target.style.backgroundColor==colorArray[2]){
            //クリックしたセルにすでに石が置かれていたら
                alert("そのマスは埋まっています。");
            }else{
            //そうでなければ、
                let x = Math.floor(Number(e.target.id)/10);
                let y = Number(e.target.id)-10*x;
                //クリックしたセル(td)のidから、そのx座標を求めた。
                ////Number()は文字列を数値に変換するメソッド、
                ////Math.floor()は小数点以下切り捨てのためのメソッド(今回は)。
                ////C言語で演算子「/」は商を求めるが、JSの演算子「/」は余りが出ない
    
                searchSurroundingEight(x,y,turn%2*2);
                //turn%2 => 0 or 1
                //turn%2*2 => 0 or 2
                //colorArray[]の添え字として使う引数
                interimReport();
            }
        }
        const searchSpecificDirection = (x,y,direction,which) => {
            ////関数名・・・特定の方向を調べる
            let wantToPut = toCell(x,y);
            //クリックしたマスを取得。
            sandwichedCells = [];//初期化
            howManySearches = 1;//初期化
            judge = 1;//初期化
    
            //クリックしたマスを原点とした、directionのxy座標。
            ////見かけのx,y座標という意味でapparent
            apparentX = direction-(3*(Math.floor(direction/3)))-1;
            apparentY = (direction-(apparentX+1))/3-1;
    
            for(howManySearches=1;judge==1;howManySearches++){
                //調べるマス
                subCellX = x+apparentX*(howManySearches+1);
                subCellY = y+apparentY*(howManySearches+1);
                subjectCell = toCell(subCellX,subCellY);
                ////subjectCellXではなくsubCellXとすることで、読みやすいだけでなく、VSCodeの機能である予測変換がしやすくなる。
    
                //その直前のマス。
                ////接頭句preには「前の」の意がある
                preCellX = x+apparentX*howManySearches;
                preCellY = y+apparentY*howManySearches;
                previousCell = toCell(preCellX,preCellY);
                //配列に追加
                sandwichedCells.push(previousCell);//FIXME
                if(subjectCell==null) {
                    return 0;
                }else{
                    if(subjectCell.style.backgroundColor==colorArray[(which-1)*(-1)+1]){
                    //調べるマスの色が相手の色だったら、
                        judge = 1;
                        //その先のマスを調べる
                    }else if(subjectCell.style.backgroundColor==colorArray[which]){
                    //調べるマスの色が自分の色だったら、例えば○●○のようになっているはずなので、
                        sandwichedCells.push(wantToPut);
                        //置きたいマスも配列に入れる
                        let tmp1 = sandwichedCells.length;
                        //その時点での配列の長さを保持しておく
                        ////(直後のfor文で使うためだが、ii<=~~.lengthとしてしまうと、forの1回の処理が終わるたびにそれが変わってしまうため、別の変数に保持しておく必要がある。)
                        console.log(sandwichedCells);
                        for(let ii=1;ii<=tmp1;ii++){
                            sandwichedCells.shift().style.backgroundColor = colorArray[which];
                            //オセロの石をひっくり返す、置く処理
                        }//ループから抜ける
                        return 1;
                    }else{
                    //調べるマスの色(?)が元のままかborderだったら、
                        judge = 0;
                        return 0;//ループから抜ける
                    }
                }
            }
            return 0;
        }
        const searchSurroundingEight = (xx,yy,which) => {
            ans.length=0;//初期化
    
            //置きたいマスの周囲8マスについて、相手の色の石が存在するか調べる
            /*
            ansの配列の添え字  
                0 1 2
                3 4 5
                6 7 8
            存在する=>1、存在しない=>0
            */
            for(let b=-1;b<=1;b++){
                for(let a=-1;a<=1;a++){
                    if(toCell(xx+a, yy+b).style.backgroundColor == colorArray[(which-1)*(-1)+1]){//調べるマスに相手の色の石が存在したら、
                        ans.push(1);
                        //配列ansに1を追加。
                    }else{//そうでなければ、
                        ans.push(0);
                        //配列ansに0を追加。
                    }
                }
            }
            if(ans.includes(1)==true){
            //配列ansに1が存在したら => 周囲8マスに相手の石が存在したら、
                let indices = [];//初期化
                let result = [];//初期化
        
                let idx = ans.indexOf(1);//最初から探索し、要素と引数が一致した最初の要素の添え字が返される。1つも無ければ-1が返される。
                while (idx != -1) {//1が存在したら、
                    indices.push(idx);//配列indicesに追加。
                    idx = ans.indexOf(1, idx + 1);//第2引数は探索の開始位置。
                }
                
                let tmp2 = indices.length;//本コード48行目の、変数tmp1と同じ役割。
                for(index=0;index<=tmp2-1;index++){
                    result.push(searchSpecificDirection(xx,yy,indices.shift(),which));
                    //ひっくり返ったかどうかの判定に使う。関数searchSpecificDirectionの戻り値を配列resultに追加する。
                    ////変数 = 配列名.shift() で,配列名の最初の要素を取り出し、変数に格納する。
                }
                if(result.includes(1)){
                //配列resultの要素に1が存在したら、=> ひっくり返ったら
                    turn++;//ターンが進む
                }else{
                    alert("そのマスには置けません。");
                }
            }else{
            //配列ansに1が存在しなかったら => 周囲8マスに相手の石が存在しなかったら、
                alert("そのマスには置けません。");
            }
        }
        const finishGame = () => {
            let redPoints = 0;
            let greenPoints = 0;
            let point;
            let color;
            for(i=0;i<=9;i++){
                for(j=0;j<=9;j++){
                    point = Number(toCell(i,j).innerText);
                    color = toCell(i,j).style.backgroundColor;
                    if(color == colorArray[0]){
                        redPoints += point;
                        console.log(point);
                    }else if(color == colorArray[2]){
                        greenPoints += point;
                        console.log(point);
                    }else{
                        console.log(color);
                    }
                }
            }
            if(redPoints===greenPoints){
                   document.getElementById("finalResult").innerText
                   ="引き分け！！";
            }else{
                document.getElementById("finalResult").innerText
                = `赤・・・${redPoints} 点、緑・・・${greenPoints} 点で、
                ${(redPoints>greenPoints)?"赤":"緑"} の勝利！`
            }
        }
        const calculateSum = (totalValue, currentValue) => {
            console.log(totalValue + currentValue);
            return totalValue + currentValue;
        }
        const interimReport = () => {
            const reds = [];
            const greens = [];
            let redCells = 0;
            let greenCells = 0;
            let redPoints = 0;
            let greenPoints = 0;
            const redDisp = document.getElementById("redDisp");
            const greenDisp = document.getElementById("greenDisp");
            let redText;
            let greentext;
            console.log(toCell(4,4).style.backgroundColor);
            for(let i=1;i<=8;i++){
                for(let j=1;j<=8;j++){
                    if(toCell(i,j).style.backgroundColor==colorArray[0]){
                        reds.push(toCell(i,j));
                    }else if(toCell(i,j).style.backgroundColor==colorArray[2]){
                        greens.push(toCell(i,j));
                    }
                }
            }
            redCells = reds.length;
            greenCells = greens.length;
            const redPointsArray = reds.map(element => {
                return element.innerText;
            });
            const greenPointsArray = greens.map(element => {
                return element.innerText;
            });
            redPoints = redPointsArray.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue)
            );
            greenPoints = greenPointsArray.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue)
            );
            /*
            redPoints = reds.reduce(calculateSum);
            greenPoints = greens.reduce(calculateSum);
            */
            redText = `赤：${redCells}マス、${redPoints}点`;
            greentext = `緑：${greenCells}マス、${greenPoints}点`
            redDisp.innerText = redText;
            greenDisp.innerText = greentext;
        }
        for(let i=0;i<=9;i++){
            let tr = document.createElement("tr");
            let fragment = new DocumentFragment();
            /*
            ひとつのオブジェクトに大量に子要素を挿入したい場合（今回ならtrに4つのtdを挿入）、fragmentというオブジェクトを作成し、そこに子要素を追加し、fragmentを挿入したい親要素に挿入したほうが実装が早いらしい。
            けど私もここでtableに4つのtrを挿入する際に手を抜いてfragmentを使わずにやってます。使ってみたかっただけ
            */
            for(let j=0;j<=9;j++){
                //オセロ盤面は8*8マスであるが、探索の記述を減らすために10*10として、見えない枠を作った。
                ////実際web上でクリックすると何かが起こる。
                let td = document.createElement("td");
                td.id=(10*j+i).toString(10);
                ////数値.toString(10)数値を10進数として認識し、それを文字列に変換する
                ////.toStringなくても普通に動く(キャスト)
                if(i==0||i==9||j==0||j==9){
                    td.classList.add( "border" );
                    td.innerText="";
                    td.style.backgroundColor=colorArray[3];
                    //class名を設定することで、CSSでデザインを操作しやすくしている。
                }
                td.addEventListener("click",clickCell,false);
                //tdにイベント属性を追加している。
                ////第3引数のfalseはお決まり。基本これでよい。なんなら省略してもよい。
                ////onClickよりこっちのほうがいいらしい。
                fragment.appendChild(td);
            }
            tr.appendChild(fragment);
            table.appendChild(tr);
        }
        field.appendChild(table);
    
        for(i=0;i<=9;i++){
            for(j=0;j<=9;j++){
                let td = document.getElementById(`${i*10+j}`);
                if(td.className=="border"){
                    console.log(td);
                    td.removeEventListener('click',clickCell);
                }
            }
        }
    
        for(i=1;i<=8;i++){
            for(j=1;j<=8;j++){
                let id=10*i+j;
                let td = document.getElementById(`${id}`);
                td.innerText = kadoTsuyo.shift();
            }
        }
    
    
        const restartBut = document.getElementById("restart");
        restartBut.addEventListener("click",()=>{
            window.location.reload();
        },false)
    
        const skipBut = document.getElementById("skip");
        skipBut.addEventListener("click",()=>{
            clickCell(++turn);
        },false)
    
        const finishBut = document.getElementById("finish");
        finishBut.addEventListener("click",()=>{
            finishGame();
        },false)
    
        //オセロ中心4マスの石
        toCell(4,4).style.backgroundColor=colorArray[0];
        toCell(5,5).style.backgroundColor=colorArray[0];
        toCell(4,5).style.backgroundColor=colorArray[2];
        toCell(5,4).style.backgroundColor=colorArray[2];
    }