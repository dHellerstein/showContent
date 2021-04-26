// Helper functions for wsShowContent.js
//
// Usage. Inside of a showContent box (typically, in its header) include a button like:
//      <input type="button" value="View resize menu!" onClick="wsShowContent_resizeMenu(this)">   ' ;
//
//=============================
// Present a menu to let a user positon and resize a wsShowContent box (actually, its parent ws_moveBox)
// THis button starts the resizing-== using the "showCONtent" box it is in to dictate what to resize

function  wsShowContent_resizeMenu(athis) {
   var amess='';
   let ethis=wsShowContent_argJquery(athis);
   let eparent=ethis.closest('.ws_showContent_mainC');
   if (eparent.length!==1) return 0 ;     // not inside ashowContent box (in a movebox)
   let econtent=eparent.find('.ws_showContent_contentC');
   if (econtent.length!=1) return 0;
   let egot=econtent.find('.ws_showContentResizeMenu_c'); // tggle off (by removing)
   if (egot.length>0) {
       egot.remove();
       return 0;
   }
   amess+='<div class="ws_showContentResizeMenu_c">';
   amess+='<input type="button" value="X" title="close this resize menu" onClick="ws_showContentResizeMenu_close(this)">';

   curOptions=wsMoveBox.ws_DoResize(0,eparent);   // get current "permanent" specs

   amess+='<b>Change size and position of this viewing box.. </b>';
   amess+='<table cellpadding="2">';
   amess+='<tr><td align="left" width="30%">';
   amess+='<div style="border:1px dotted gold" ';
   amess+='  title="The current size and position of this content box is listed in these input fields. ';
   amess+=' You can change these absolute screen locations, or adjustments to the current specifications.&#013;';
   amess+=' New sizes & positions can be specified as xxPX, xxEM, or xx% &#013;';
   amess+=' Relative changes -- based on these permanent values -- are specified with `-xxEM` or `+xxEM` (or px or% ) "';
   amess+='>';
   amess+='<span style="font-style:oblique;border-bottom:1px dotted blue">?</span> <em>The permanent postion</em><br>';
   amess+='<menu style="margin:3px;list-style:none;padding:2px"> ';

   for  (let aspec in curOptions) {
      amess+='<li style="margin:2px 2px 4px 2px;padding:2px"><input type="text" size="5" was="'+curOptions[aspec]+'" what="'+aspec+'" ';
      amess+= '  title="Change this spec" size="10" class="ws_boxSizeMenu_input" value="'+curOptions[aspec]+'">';
      amess+=' <b>'+aspec+'</b>';
   }
      amess+='</menu></div>';
   amess+='</td> ';
   amess+='<td  align="left"  width="68%" style="display:none" class="ws_showContentResizeMenu_step2">';
   amess+='</div>';
   amess+='</td></tr></table>'

   amess+='<input type="button" value="Review change" title="click here after specifying new size and position" onClick="ws_showContent_resizeMenu_2(this)">';
   amess+='</div>';
   econtent.prepend(amess);

}


//==========================
// after change button hit  -- read new specs from input fields
function ws_showContent_resizeMenu_2(athis) {
   let ethis=wsShowContent_argJquery(athis) ;
   var amess='';
   let eTopParent=ethis.closest('.ws_showContent_mainC');
   let eparent=ethis.closest('.ws_showContentResizeMenu_c');
   let eshow=eparent.find('.ws_showContentResizeMenu_step2');
   let einputs=eparent.find('.ws_boxSizeMenu_input');
   let aspecs={} , inpVals={} ;
   einputs.each(function(indx){
       let ee=$(this);
       let ename=ee.attr('what');
       let aval=ee.val();
       inpVals[ename]=aval;
       aspecs[ename]=aval;
   });
   let newdo=wsMoveBox.ws_DoResize(aspecs,eTopParent,1);     // test mode

   amess+='<ul style="margin:3px"; padding:3px; list-style:none">';
   jQuery.each(newdo,function(indx,vv){
       amess+='<li><b>'+indx+'</b> <span style="font-size:90%"><tt>'+vv[0]+'</tt> to </span> to <u>'+vv[1]+'</u> <span style="font-size:85%"> (using '+inpVals[indx]+')</span>             ';
   });
   amess+='</ul>';
   amess+='<input type="button" value="Make the change!" title="Make these changes, or try different ones, or close"  onClick="ws_showContent_resizeMenu_3(this)">';

   amess+='<input type="button" value="x" style="font-size:80%" title="close this resize menu" onClick="ws_showContentResizeMenu_close(this)">';

   eshow.html(amess).show();

   return 1;
 }

//==========================
// after confirm button hit
function ws_showContent_resizeMenu_3(athis) {
    let ethis=wsShowContent_argJquery(athis) ;

   let eparentBox=ethis.closest('.ws_showContent_mainC');
   var stuff={};
   let eparent=ethis.closest('.ws_showContentResizeMenu_c');
   let eshow=eparent.find('.ws_showContentResizeMenu_step2');
   let einputs=eparent.find('.ws_boxSizeMenu_input');

   let amess='<b>Changing size and positon ...</b><br>' ;

   einputs.each(function(indx){
       let ee=$(this);
       let aval=ee.val();
       let ename=ee.attr('what');
       stuff[ename]=aval ;
   } );

   newOptions=wsMoveBox.ws_DoResize(stuff,eparentBox); // make the change!

   amess+='<em>Position &amp; size changed: <ul style="margin:3px;padding:3px;list-style:none">';
   for (let aspec in newOptions) {
      amess+='<li><b>'+aspec+'</b>  &rarr; '+newOptions[aspec][1];
   }
   amess+='</ul>';
   amess+='<input type="button" value="X" title="close this resize menu" onclick="ws_showContentResizeMenu_close(this)">   ';
   eshow.html(amess);

}

//=========
// close the.ws_showContentResizeMenu_c box this button is in
function ws_showContentResizeMenu_close(athis) {
   ethis=wsShowContent_argJquery(athis);
   eparent=ethis.closest('.ws_showContentResizeMenu_c');
   eparent.remove();
}
//====================    foo   thisDayStep,thisDay ;

function wsShowContent_argJquery(ado,which) {
   if (ado instanceof jQuery)  return ado ;  // already jquery object
   if (arguments.length<2) which='target';

   if (which!='target' && which!=='currentTarget' && which!=='delegateTarget' && which!=='relatedTarget') which='target';

   if (typeof(ado)=='string') {       // kind of odd to use this function for this, but just in case
       oof=$(ado);
       if (oof.length==0) return false ;
       return oof ;
   }
   if (typeof(ado)!=='object') return false ;   // should rarely happen

   if (typeof(ado.originalEvent)!=='undefined' && typeof(ado.target)!=='undefined') return $(ado[which]);  // from an .on
   if (typeof(ado.currentTarget)!=='undefined' && typeof(ado.target)!=='undefined') return $(ado[which]);  // from an .addEventListener


   oof=$(ado);                  // a this
   if (oof.length==0) return false;
   return oof;
}

