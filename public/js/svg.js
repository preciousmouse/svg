
$(function(){
	$("#picker").farbtastic("#color");
})

jsPlumb.ready(function(){
	var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:"StateMachine",
		// HoverPaintStyle: {strokeWidth: 4 },
		// 启用hover style之后无法对连线进行手动染色
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "", id: "label", cssClass: "aLabel" }]
        ],
        Container: "root"
    });
	instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

	instance.bind('click',function(c){
		instance.deleteConnection(c);
	});
	instance.bind("connection", function (info) {
		info.connection.getOverlay("label").setLabel('');//(info.connection.id);
	});

	window.jsp = instance;
	var root = $("#root");

	
	$("body").on('dblclick','.wtext',function(e){
		toReplace(e.target);
		e.stopPropagation();
	})
	$("body").on('click','.marker',function(e){
		$("body").addClass("painting");
		paintColor();
		e.stopPropagation();
	})
	$("body").on('dblclick','.marker',function(e){
		$("body").addClass("painting");
		paintColor();
		e.stopPropagation();
	})
	$("body").on("dblclick", '#root', function(e) {
		if($('body').hasClass('painting')){
			return false;
		}
        newNode(e.offsetX, e.offsetY);
	});

	var initNode = function(el) {
        // initialise draggable elements.
        instance.draggable(el);
        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { stroke: "#123456", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: -1
        });
        instance.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
        // version of this demo to find out about new nodes being added.
        //
        instance.fire("jsPlumbDemoNodeAdded", el);
	};
	var newNode = function(x, y) {
        var d = document.createElement("div");
        var id = jsPlumbUtil.uuid();
        d.className = "w";
        d.id = id;
		// d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
		d.innerHTML = "<div class=\"wtext\">"+id.substring(0,7)+"</div> " + "<div class=\"ep\"></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
		initNode(d);
        return d;
	};
	
	var toReplace = function(divElement) {
		// 创建一个input元素
		var inputElement = document.createElement("input");
		// 把obj里面的元素以及文本内容赋值给新建的inputElement
		inputElement.value = divElement.innerHTML;
	 
		// 用新建的inputElement代替原来的oldDivElement元素
		divElement.parentNode.replaceChild(inputElement, divElement);
		inputElement.focus();
		inputElement.select();
		// 当inputElement失去焦点时触发下面函数，使得input变成div
		inputElement.onblur = function() {
			//把input的值交给原来的div
			divElement.innerHTML = inputElement.value;
			//用原来的div重新替换inputElement
			inputElement.parentNode.replaceChild(divElement, inputElement);
		}
	}

	var paintColor = function() {
		var color = $("#color").val();
		$("body")[0].addEventListener('click',function(e){
			e.stopPropagation();
			$("body").removeClass("painting");
			var ele = $(e.target);
			if(ele.hasClass('w')){
				ele.css({'border-color':color});
				ele.children(".ep").css({'background-color':color})
			}else if(ele.hasClass('aLabel')){
				ele = ele.prev();
				ele.children('path').eq(1).attr('stroke',color);
				ele.children('path').eq(2).attr('fill',color);
			}else if(ele.parent().prop('tagName')==="svg"){
				ele = ele.parent();
				ele.children('path').eq(1).attr('stroke',color);
				ele.children('path').eq(2).attr('fill',color);
			}
		},{capture:true, once:true});
	}

	instance.batch(function () {
        // for (var i = 0; i < windows.length; i++) {
        //     initNode(windows[i], true);
        // }
        // // and finally, make a few connections
        // instance.connect({ source: "opened", target: "phone1", type:"basic" });
        // instance.connect({ source: "phone1", target: "phone1", type:"basic" });
        // instance.connect({ source: "phone1", target: "inperson", type:"basic" });

        // instance.connect({
        //     source:"phone2",
        //     target:"rejected",
        //     type:"basic"
        // });
	});
	jsPlumb.fire("jsPlumbDemoLoaded", instance);
});