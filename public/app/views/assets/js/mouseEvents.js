//Getting Mouse Coordinates




var coord =  function(event) {
   // console.log($(':hover').last().attr('name'));
   var x = event.clientX;
    console.log(x);
    var y = event.clientY;
    console.log(y);
    var element = document.elementFromPoint(x, y);
    console.log(element);
    draw(element)
   }
  