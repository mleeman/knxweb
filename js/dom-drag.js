/**************************************************
 * dom-drag.js
 * 09.25.2001
 * www.youngpup.net
 * Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
 **************************************************
 * 10.28.2001 - fixed minor bug where events
 * sometimes fired off the handle, not the root.
 **************************************************/

var Drag = {

	obj : null,

	init : function(o, oRoot)
	{
		o.onmousedown	= Drag.start;

		o.root = oRoot && oRoot != null ? oRoot : o ;

		if (isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
		if (isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";

		o.root.onDragStart	= new Function();
		o.root.onDragEnd	= new Function();
		o.root.onDrag		= new Function();
	},

	start : function(e)
	{
		var o = Drag.obj = this;
		e = Drag.fixE(e);
		var y = parseInt(o.root.style.top);
		var x = parseInt(o.root.style.left);
		o.root.onDragStart(x, y);

		o.lastMouseX	= e.clientX;
		o.lastMouseY	= e.clientY;

		document.onmousemove	= Drag.drag;
		document.onmouseup		= Drag.end;

		return false;
	},

	drag : function(e)
	{
		e = Drag.fixE(e);
		var o = Drag.obj;

		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(o.root.style.top);
		var x = parseInt(o.root.style.left);
		var nx, ny;

		nx = x + (ex - o.lastMouseX);
		ny = y + (ey - o.lastMouseY);
		
		if (Drag.grid) {
		    var m = Math.floor(Drag.grid/2);
			ex = ex - nx%Drag.grid + m;
			ey = ey - ny%Drag.grid + m;
			nx = nx - nx%Drag.grid + m;
			ny = ny - ny%Drag.grid + m;
		}

		Drag.obj.root.style["left"] = nx + "px";
		Drag.obj.root.style["top"] = ny + "px";
		Drag.obj.lastMouseX	= ex;
		Drag.obj.lastMouseY	= ey;

		Drag.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function()
	{
		document.onmousemove = null;
		document.onmouseup   = null;
		Drag.obj.root.onDragEnd(	parseInt(Drag.obj.root.style["left"]), 
									parseInt(Drag.obj.root.style["top"]));
		Drag.obj = null;
	},

	fixE : function(e)
	{
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};
Drag.grid = 0;
