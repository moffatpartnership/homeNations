// startup vars
var fnappHeight = 800,
    fnappWidth = 1102,
    fnimages = [],
    fnloader;

// wrapper for our "classes", "methods" and "objects"
window.FNViewer = {};

//fnloader
(function(){

    var allData, srcItems, dataItems, dataload;

    function Loader() {

    }

    Loader.prototype.loadData = function() {

        var storygroupid = document.getElementById("canvasFourNations").getAttribute("data-haplogroup-id");

        $.getJSON('https://api.moffpart.com/api/1/databases/sdnacontent/collections/c2FourNations?q={"storygroupid":"'+ storygroupid +'"}&apiKey=50e55b5fe4b00738efa04da0&callback=?', function(ret,stat) {

            srcItems = ret[0].srcItems;
            dataItems = ret[0].dataItems;

            var manifest = [
                {src:srcItems.welshFlag, id:"welsh"},
                {src:srcItems.englishFlag, id:"english"},
                {src:srcItems.scottishFlag, id:"scottish"},
                {src:srcItems.irishFlag, id:"irish"}
            ];

            fnloader = new createjs.LoadQueue(false);
            fnloader.addEventListener("fileload", handleFileLoad);
            fnloader.addEventListener("complete", handleComplete);
            fnloader.loadManifest(manifest);

            function handleFileLoad(event) {
                fnimages.push(event.item);
            }

            function handleComplete(event) {

                parseData();
            }
        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading mapItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + fnappHeight + "px; width:" + fnappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        dialogElement.appendChild(spinElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasFourNations").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            dataItems:dataItems
        };

        return allData
    };

    FNViewer.Loader = Loader;

})();

// artboard
(function(){

    // data
    var interactionObject, dataItems;

    function Artboard(){

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };

    }

    Artboard.prototype.dataLoad = function (data){

        dataItems = data.dataItems;
    };

    Artboard.prototype.zoom = function (user){

    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->
        var background = new createjs.Container();
        displayObject.addChild(background);

        var largestNum = dataItems.largest + Math.round(dataItems.largest/10);
        if (largestNum > 5) {
            var gap = 5;
            var numGraph = Math.ceil(largestNum/gap);
            var interval = (550)/numGraph;
        } else {
            gap = 1;
            numGraph = 5;
            interval = (550)/numGraph;
        }

        // graph items
        var linesnshit = new createjs.Shape();
        var initLine = 600 - interval;

        for (var i = 0; i < numGraph; i++) {

            linesnshit.graphics.setStrokeStyle(1).beginStroke("#DDD");
            linesnshit.graphics.moveTo(40, initLine);
            linesnshit.graphics.lineTo(fnappWidth-40, initLine);

            var axisLegend = new createjs.Text((i+1)*gap,"15px Petrona","#888");
            axisLegend.x = 58;
            axisLegend.y = initLine - 22;
            axisLegend.textAlign = "center";
            background.addChild(axisLegend);

            initLine -= interval;

        }

        // flagpoles
        linesnshit.graphics.setStrokeStyle(10).beginStroke("#BBB");
        var labels = ["England", "Scotland", "Wales", "Ireland"]
        var poleX = 120;
        for (var j = 0; j < 4; j++) {

            linesnshit.graphics.moveTo(poleX, 600);
            linesnshit.graphics.lineTo(poleX, 30);

            var flagTop = new createjs.Shape();
            flagTop.graphics.beginFill("#BBB").drawCircle(poleX,32,10);
            background.addChild(flagTop);

            var xAxisLegend = new createjs.Text(labels[j],"18px Petrona","#888");
            xAxisLegend.x = poleX +100;
            xAxisLegend.y = 32;
            xAxisLegend.width = 250;
            xAxisLegend.textAlign = "center";
            background.addChild(xAxisLegend);

            poleX += 240;
        }

        linesnshit.graphics.setStrokeStyle(2).beginStroke("#888");
        // x-axis
        linesnshit.graphics.moveTo(40, 600);
        linesnshit.graphics.lineTo(fnappWidth-40, 600);
        // y-axis
        linesnshit.graphics.moveTo(80, 600);
        linesnshit.graphics.lineTo(80, 30);

        background.addChild(linesnshit);

        var tick = interval/gap;

        var englishY = 600 - tick*dataItems.england;
        var EnglishFlag = new createjs.Bitmap(fnloader.getResult("english"));
        EnglishFlag.x = 120;
        EnglishFlag.y = englishY;
        background.addChild(EnglishFlag);

        var englishTotal = new createjs.Text(dataItems.england + "%","30px Petrona","#888");
        englishTotal.x = 210;
        englishTotal.y = englishY - 30;
        background.addChild(englishTotal);

        var scottishY = 600 - tick*dataItems.scotland;
        var ScottishFlag = new createjs.Bitmap(fnloader.getResult("scottish"));
        ScottishFlag.x = 360;
        ScottishFlag.y = scottishY;
        background.addChild(ScottishFlag);

        var scottishTotal = new createjs.Text(dataItems.scotland + "%","30px Petrona","#888");
        scottishTotal.x = 450;
        scottishTotal.y = scottishY - 30;
        background.addChild(scottishTotal);

        var welshY = 600 - tick*dataItems.wales;
        var WelshFlag = new createjs.Bitmap(fnloader.getResult("welsh"));
        WelshFlag.x = 600;
        WelshFlag.y = welshY;
        background.addChild(WelshFlag);

        var welshTotal = new createjs.Text(dataItems.wales + "%","30px Petrona","#888");
        welshTotal.x = 690;
        welshTotal.y = welshY - 30;
        background.addChild(welshTotal);

        var irishY = 600 - tick*dataItems.ireland;
        var OirishFlag = new createjs.Bitmap(fnloader.getResult("irish"));
        OirishFlag.x = 840;
        OirishFlag.y = irishY;
        background.addChild(OirishFlag);

        var OirishTotal = new createjs.Text(dataItems.ireland + "%","30px Petrona","#888");
        OirishTotal.x = 930;
        OirishTotal.y = irishY - 30;
        background.addChild(OirishTotal);

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->

        var background = new createjs.Container();
        displayObject.addChild(background);

        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->


        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    FNViewer.Artboard = Artboard;

})();

// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        dashboardRedraw, dashboardBackground, dashboardEventArea,
        highlightContainer, highlightBackground, highlightRedraw, highlightEventArea,
        loader, loadStatus;

    FNViewer.loadInit = function(){

        //stats = new Stats();
        //$('.block').prepend(stats.domElement);

        // prepare the view
        view = new FNViewer.Artboard(fnappWidth,fnappHeight);

        // fnloader init
        loader = new FNViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.width = fnappWidth;
        canvas.height = fnappHeight;
        document.getElementById("canvasFourNations").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, fnappWidth, fnappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, fnappWidth, fnappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);


        TweenMax.ticker.addEventListener("tick", frameRender);

    }

    function loadRequest(event) {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            //control.controlData(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender(event) {

        //stats.begin();

        artboardRedraw.removeAllChildren();

        view.redraw(artboardRedraw);

        // update stage
        stage.update();

        //stats.end();
    }

})();

//Init
FNViewer.loadInit();

// utils

//sorts array by key
/*function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var
            x = a[key],
            y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}*/
