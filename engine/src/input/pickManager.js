/**
 * @fileoverview Pick Manager - singleton to manage currently picked object(s)
 * 
 * @author Tony Parisi
 */

goog.provide('Vizi.PickManager');

Vizi.PickManager.handleMouseMove = function(event)
{
    if (Vizi.PickManager.clickedObject && Vizi.PickManager.clickedObject.onMouseMove)
    {
    	Vizi.PickManager.objectFromMouse(event); // get new mouse coords
        Vizi.PickManager.clickedObject.onMouseMove(event);
    }
    else
    {
        var oldObj = Vizi.PickManager.overObject;
        Vizi.PickManager.overObject = Vizi.PickManager.objectFromMouse(event);

        if (Vizi.PickManager.overObject != oldObj)
        {
    		if (oldObj)
    		{
    			Vizi.Graphics.instance.setCursor(null);
    			
    			if (oldObj.onMouseOut)
                {
                    oldObj.onMouseOut(event);
                }
    		}

            if (Vizi.PickManager.overObject)
            {            	
	        	if (Vizi.PickManager.overObject.overCursor)
	        	{
	        		Vizi.Graphics.instance.setCursor(Vizi.PickManager.overObject.overCursor);
	        	}
	        	
	        	if (Vizi.PickManager.overObject.onMouseOver)
	        	{
	        		Vizi.PickManager.overObject.onMouseOver(event);
	        	}
            }
        }
    }
}

Vizi.PickManager.handleMouseDown = function(event)
{
    Vizi.PickManager.clickedObject = Vizi.PickManager.objectFromMouse(event);
    if (Vizi.PickManager.clickedObject && Vizi.PickManager.clickedObject.onMouseDown)
    {
        Vizi.PickManager.clickedObject.onMouseDown(event);
    }
}

Vizi.PickManager.handleMouseUp = function(event)
{
    if (Vizi.PickManager.clickedObject && Vizi.PickManager.clickedObject.onMouseUp)
    {
    	Vizi.PickManager.objectFromMouse(event); // get new mouse coords
    	Vizi.PickManager.clickedObject.onMouseUp(event);
    }

    Vizi.PickManager.clickedObject = null;
}

Vizi.PickManager.handleMouseScroll = function(event)
{
    if (Vizi.PickManager.overObject && Vizi.PickManager.overObject.onMouseScroll)
    {
        Vizi.PickManager.overObject.onMouseScroll(event);
    }

    Vizi.PickManager.clickedObject = null;
}

Vizi.PickManager.objectFromMouse = function(event)
{
	var intersected = Vizi.Graphics.instance.objectFromMouse(event);
	if (intersected.object)
	{
		event.normal = intersected.normal;
		event.point = intersected.point;
		
    	if (intersected.object.picker)
    	{
    		return intersected.object.picker;
    	}
    	else
    	{
    		return Vizi.PickManager.findObjectPicker(intersected.object.object);
    	}
	}
	else
	{
		return null;
	}
}

Vizi.PickManager.findObjectPicker = function(object)
{
	while (object)
	{
		if (object.data && object.data.picker)
		{
			return object.data.picker;
		}
		else
		{
			object = object.parent;
		}
	}
	
	return null;
}


Vizi.PickManager.clickedObject = null;
Vizi.PickManager.overObject  =  null;