var initRoateBox = function() {
  var box = document.querySelector('#calender-block-container').children[0],
      showPanelButtons = document.querySelectorAll('#show-buttons button'),
      panelClassName = 'show-front-test2',

      onButtonClick = function( event ){
        // console.log(panelClassName);
        box.removeClassName( panelClassName );
        // box.className = "";
        panelClassName = event.target.className;
        box.addClassName( panelClassName );
        // console.log(panelClassName);        
      };

  for (var i=0, len = showPanelButtons.length; i < len; i++) {
    showPanelButtons[i].addEventListener( 'click', onButtonClick, false);
  }
  
  box.toggleClassName('panels-backface-invisible');
  
};
  
window.addEventListener( 'DOMContentLoaded', initRoateBox, false);