// =============  moveAble box FUNCTIONS ==================

/* Copyright 2021. Daniel Hellerstein (danielh@crosslink.net)

    wsMoveBoxes  is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wsMoveBoxes  is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with wsMoveBoxes   If not, see <http://www.gnu.org/licenses/>.

    See wsMoveBoxes.txt for useage instructions
    
    Note: wsMoveBoxes requires jQuery


*/

 
//=================
// create a few css rules  -- do this here so you don't need to require a <style>

$('<style id="wsMoveBoxes_css">').prop("type","text/css")
 .html(" \
.ws_moveButtonNE {z-index:2;opacity:1.0;font-size:8px;padding:0px;} \
.ws_moveButtonNW {z-index:2;opacity:1.0;font-size:8px;padding:0px;position:absolute;left:-3px;top:-3px; } \
.ws_moveButtonSW {z-index:2;opacity:1.0;font-size:8px;padding:0px;position:absolute;left:-3px;bottom:-2px} \
.ws_moveButtonSE {z-index:2;opacity:1.0;font-size:8px;padding:0px;position:absolute;right:-2px;bottom:-2px} \
.ws_moveButtonSEi,.ws_moveButtonSWi,.ws_moveButtonNWi,.ws_moveButtonNEi {z-index:2;opacity:1.0;font-size:8px;padding:0px;} \
.ws_NoSelect {user-select:none } \
.ws_Button {z-index:1;border-radius:5px;font-size:75%;padding: 0px 0px 0px 0px;margin:-2px 0px 0px 2px;text-align:center;vertical-align:middle;} \
.ws_ZindexUp {z-index:2;opacity:1.0;border-radius:5px;font-size:75%;padding: 0px 0px 0px 0px;margin:-2px 0px 0px 2px;text-align:center;vertical-align:middle;} \
.ws_Expander {z-index:2;opacity:1.0;border-radius:5px;font-size:75%;padding: 0px 0px 0px 0px;margin:-2px 0px 0px 2px;text-align:center;vertical-align:middle;} \
.ws_Callfunc {z-index:2;opacity:1.0;border-radius:5px;font-size:75%;padding: 0px 0px 0px 0px;margin:-2px 0px 0px 2px;text-align:center;vertical-align:middle;color:blue} \
.ws_ButtonsUpperRight {position:absolute;font-size;300%;right:2px;top:2px;color:blue;padding:2px; background-color:#fafbfc;} \
.ws_NEButtons {z-index:3; background-color:#dbdbab;position:absolute; top:-4px;right:-2px;padding:0px 5px 0px 5px; }\
.ws_TopBar {z-index:1;opacity:0.5;height:9px;font-size:5px;overflow:hidden;background-color:#dbdbab; \
                   border:1px dotted gray;position:absolute; \
                   top:-8px;left:1%;width:98%;xmargin-top:-2px} \
.ws_TopBarFat {z-index:1;opacity:0.5;height:19px;font-size:5px;overflow:hidden;background-color:#dcdcac; \
                   border:1px dotted gray;position:absolute; \
                   top:-8px;left:1%;width:98%;xmargin-top:-2px} \
.ws_Expand{z-index:2;height:92% !important;width:94% !important;left:2% !important;top:2% !important}  \
.ws_moveButton_tipsUl {list-style-type:none} \
.ws_moveButton_tipsUl li {color:darkblue; text-indent: -1em;margin-left: 2em;} \
.ws_moveButton_tipsButton {cursor:help;color:blue;background-color:#aabbaa;border-radius:4px;padding;2px;font-size:60%;border:1px groove lightblue;}\
.ws_moveButton_restoreSizeButton {cursor:row-resize;color:blue;background-color:#aabbaa;border-radius:4px;padding;2px;font-size:60%;border:1px groove lightblue;}\
")
 .appendTo("head");

 var wsMoveBox=function() {        // create a module object with public and private functions

   var version='v2.1.2';


//==========================
// convert a generic box (i.e.; a div with minimal formatting) into a fixed position moveable box
 function ws_Create(aid,opts) {
   var d1,width,height,fact1,atop=0,aleft=0,aright=0,abottom=0,goo,aheight,awidth,goo,ncreated,tmp,zIndexShow=0,expandBox=0,callFunc='',callFuncMess='...',nncreated ;
    var noTips=0,noCloser=0,noMover=0,noResizer=0,daz,thisClass,stuff='',noHider=0,adate,escapeOrder=0,bodyFontSize,moveTopBarFat=0,moveIcon='&#9769;' ;
    var addOverflow=0,returnJquery=0,noRestoreSize=0,removeClass='' ;

   d1=$('#'+aid);
   if (d1.length==0) abortJavaScript('wsMoveBox error: no element with id=' +aid,1);

   tmp=$('.ws_moveBox');
   nncreated=tmp.length+1;
   ncreated= Math.round(Math.random() * 2511111111115);

   adate=new Date().getTime()
   escapeOrder=adate;

   width=$(document).width();
   height=$(document).height();

   bodyFontSize=$("body").css('font-size');

   if (arguments.length<2) opts='*';

   if (typeof(opts)=='string') {        // mostly deprecated
     opts=jQuery.trim(opts);
     if (opts!=='' && opts!=='*' && opts!=='0') {
         goo=opts.split(/\s+/);
         if (goo.length>0) atop=ws_toPx(goo[0],height,bodyFontSize);
         if (goo.length>1) aright=ws_toPx(goo[1],width,bodyFontSize);
         if (goo.length>2) abottom=ws_toPx(goo[2],height,bodyFontSize);
         if (goo.length>3) aleft=ws_toPx(goo[3],width,bodyFontSize);
         awidth=parseInt(width-(aright+aleft));    if (awidth<10) awidth=parseInt(0.2*width);
         aheight=parseInt(height-(atop+abottom));  if (aheight<10) aheight=parseInt(0.2*height);
         atop=parseInt(atop); aleft=parseInt(aleft);
         stuff={position:'fixed',height:aheight+'px',width:awidth+'px',top:atop+'px',left:aleft+'px'};
         d1.css(stuff);

     } else {
        if (opts=='*') {
          awidth=parseInt(0.4*width); aheight=parseInt(0.4*height);
          aleft=parseInt(0.3*width+(25*nncreated)); atop=parseInt(0.3*height+(25*nncreated));;
          stuff={position:'fixed',height:aheight+'px',width:awidth+'px',top:atop+'px',left:aleft+'px'};
          d1.css(stuff);
        }
      }

    } else {        // associative array
       if (jQuery.isPlainObject(opts)) {
         
           stuff={position:'fixed'};

           var gotTop=0,gotRight=0;gotBottom=0,gotLeft=0;
           if (typeof(opts['top'])!=='undefined')    stuff['top']=ws_toPx(opts['top'],height,bodyFontSize)+'px'  ;
           if (typeof(opts['left'])!=='undefined')   stuff['left']=ws_toPx(opts['left'],width,bodyFontSize)+'px';
           if (typeof(opts['height'])!=='undefined') stuff['height']=ws_toPx(opts['height'],height,bodyFontSize)+'px';
           if (typeof(opts['width'])!=='undefined')  stuff['width']=ws_toPx(opts['width'],width,bodyFontSize)+'px';

           d1.css(stuff);

           if (typeof(opts['zIndexShow'])!=='undefined') zIndexShow=opts['zIndexShow'];
           if (typeof(opts['expandBox'])!=='undefined') expandBox=opts['expandBox'];
           if (typeof(opts['callFunc'])!=='undefined') callFunc=jQuery.trim(opts['callFunc']);
           if (typeof(opts['noCloser'])!=='undefined') noCloser=opts['noCloser'];
           if (typeof(opts['noTips'])!=='undefined') noTips=opts['noTips'];
           if (typeof(opts['noRestoreSize'])!=='undefined') noRestoreSize=opts['noRestoreSize'];
           if (typeof(opts['noMover'])!=='undefined') noMover=opts['noMover'];
           if (typeof(opts['moveIcon'])!=='undefined') moveIcon=opts['moveIcon'];
           if (typeof(opts['moveTopBarFat'])!=='undefined') moveTopBarFat=opts['moveTopBarFat'];
           if (typeof(opts['noResizer'])!=='undefined') noResizer=opts['noResizer'];
           if (typeof(opts['noHider'])!=='undefined') noHider=opts['noHider'];
           if (typeof(opts['removeClass'])!=='undefined') removeClass=$.trim(opts['removeClass']);
           if (typeof(opts['addOverflow'])!=='undefined') addOverflow=opts['addOverflow'];

           if (typeof(opts['returnJquery'])!=='undefined') returnJquery=opts['returnJquery'];

           if (typeof(opts['escapeOrder'])!=='undefined') escapeOrder=opts['escapeOrder'];

           callFunc=jQuery.trim(callFunc);
           if (callFunc=='0' ) callFunc='';
           if (callFunc!='') {
               aa=callFunc.split(',');
               callFunc=jQuery.trim(aa[0]);
               if (aa.length>1) callFuncMess=aa.slice(1).join(',')  ;
           }
       }
     }

     if (removeClass!='') {           // classes to rermove
        let d1_oldClass=d1[0].className ;
        d1.attr('oldClass',d1_oldClass);   // for later restoration
        if (removeClass=='*') {   // remove all of them
           d1.removeClass();
       } else {      // remove some of the current classes
          let dlist=d1_oldClass.split(/\s+/);
          let rclasses=removeClass.split(/\s+/);   // classes to REMOVE
          for (var idd=0;idd<dlist.length;idd++) {     // look at each currently active class
              let add=dlist[idd];
              if ($.inArray(add,rclasses)>=0) d1.removeClass(add);   //  in remove class list? then remove
          }
       }
     }

     let sayStuff=[] ;
     for (let ii in stuff) sayStuff.push(ii+'='+stuff[ii] ) ;

    let qvis=d1.is(':visible');  // top and left require element to be visible??!!
    if (!qvis) d1.show();

// fill in top,left,height, and width if not specified
    if (!stuff.hasOwnProperty('width'))   sayStuff.push('width='+d1.width());
    if (!stuff.hasOwnProperty('height')) sayStuff.push('height='+d1.height());
    let gooD1=d1.offset();                       // upper left of the alert box
    if (!stuff.hasOwnProperty('top')) sayStuff.push('top='+gooD1.top);
    if (!stuff.hasOwnProperty('left')) sayStuff.push('left='+gooD1.left);
    if (!qvis) d1.hide();

   d1.attr('ws_positionOriginal',sayStuff.join(','));

   d1.attr('ws_EscapeOrder',escapeOrder);
   d1.attr('escIndex',escapeOrder);
   d1.addClass('ws_moveBox');                   // used as a counter  and top level identifier

   thisClass='ws_moveBox_'+ncreated;

   tmp=d1.css('borderTopWidth');
   if (tmp=='' || tmp=='0px') { d1.css('border','1px solid black') };        // if not specified, create a border


   if (d1.css('padding-bottom')=='0px')    d1.css('padding-bottom','14px');         // if not specified, create some padding
   if (d1.css('padding-top')=='0px')    d1.css('padding-top','14px');
   if (addOverflow==1) {
       if (d1.css('overflow')=='visible') {
           d1.css('overflow','auto');          // if not specified, set overflow to auto. Made optional  6 june 2020
       }
   }

   if (d1.css('background-color')=='transparent')  d1.css('background-color','#fbfbfb');   // if not specifically transparent, add a backgrond color
    stuff='';


    if (noMover=='0' || noMover=='3' || noMover=='4') {             // bar at top "move box"
 
          let bbar='ws_TopBar ';
          if (moveTopBarFat==1)  bbar='ws_TopBarFat ';
          stuff+='<span class="ws_Control   '+bbar+'  ws_Buttons_canHide '+thisClass+'"   name="ws_moveButton_'+ncreated+'"  title="Click, and hold, to move ...."  > &nbsp;</span>';
    }

    stuff+=' <span  title="move or resize this viewing box"  class="ws_Control ws_NEButtons '+thisClass+'"   > ';
     if (noHider!='1')     stuff+='<input type="button" value="&#65377;"  class="ws_buttonViewIcon" id="hideMe_'+ncreated+'"  title="toggle view of moveableBox buttons"    style="font-size:8px;padding:0px;"    /> ';
     if (noTips!='1') stuff+='<input type="button" value="&#8505;"   id="hideMe_'+ncreated+'"  title="Display tips on how to use these controls"  class="ws_Buttons_canHide ws_moveButton_tipsButton"    /> ';

     if (noRestoreSize!='1') {
          stuff+='<input type="button" value="&#10561;"  title="Restore to original size"   ';
          stuff+='  class="ws_Buttons_canHide ws_moveButton_restoreSizeButton"  how="R"    /> ';
     }

     if (noMover=='2' || noMover=='3' || noMover=='4') {
         stuff=stuff+'<input type="button" value="'+moveIcon+'" class="ws_moveButton_icon ws_Buttons_canHide"  name="ws_moveButton_'+ncreated+'"  title="Click, and hold, to move"   style="font-size:8px;padding:0px;" /> ';
     }


     if (zIndexShow!=0) stuff+='<input type="button" value="&#9195;" id="zindexUp_'+ncreated+'"  title="Click to move to foreground&#013;RMB to move to background "   class="ws_ZindexUp ws_Buttons_canHide "  /> ';
     if (expandBox==1) stuff+='<input type="button"  value="&#128307;" expanded="0" id="viewFull_'+ncreated+'"  title="toggle full view"   name="ws_expander"  class="ws_Expander ws_Buttons_canHide" /> ';
     if (callFunc!=='') {
         stuff+='<input func="'+callFunc+'" type="button"  value="&neArr;"   id="callFunc_'+ncreated+'"  title="'+callFuncMess+'"   class="ws_Callfunc ws_Buttons_canHide" /> ';
     }
     if (noCloser!='1') stuff=stuff+'  <input type="button" value="&Chi;" id="closeMe_'+ncreated+'"  class="ws_Buttons_closerIcon ws_Buttons_canHide " title="close &#013;(rmb: close and maintain expanded state)"  style="font-size:8px;padding:0px;"/> ';

     if (noResizer=='1') {     // no rsizer buttons
         stuff=stuff+'  <input type="button" value="&nearr;" id="resizeNE_'+ncreated+'"  style="display:none" title="Click, and hold, to reize"  class="ws_moveButtonNE ws_Buttons_canHide"    /> ';
     } else if (noResizer=='2')    { // upper right button only
         stuff=stuff+'  <input type="button" value="&nearr;" id="resizeNE_'+ncreated+'"    title="Click, and hold, to reize!"  class="ws_moveButtonNE ws_Buttons_canHide"    /> ';
     } else {              // all 4 buttons
         stuff=stuff+'  <input type="button" value="&nearr;" id="resizeNE_'+ncreated+'"  title="Click, and hold, to reize"  class="ws_moveButtonNE ws_Buttons_canHide"    /> ';
     }

    stuff=stuff+'   </span> ';


   if (noResizer!='1')   {
      if (noResizer!='2')  stuff=stuff+'<span class="ws_moveButtonNW"> <input type="button" value="&nwarr;" id="resizeNW_'+ncreated+'"   title="Click, and hold, to reize" class="ws_Control   ws_moveButtonNWi '+thisClass+' "  /> </span> ';

      if (noResizer!='2') {
        stuff=stuff+'  <span  class="ws_moveButtonSW"> ';
        stuff=stuff+'<input type="button" value="&swarr;" id="resizeSW_'+ncreated+'"  title="Click, and hold, to reize" class="ws_Control  ws_moveButtonSWi '+thisClass+' "  />  ';
         if (noMover==4) {
          stuff=stuff+'<input type="button" value="'+moveIcon+'"  name="ws_moveButton_'+ncreated+'"  title="Click, and hold, to move"   class="ws_Control  ws_moveButtonSWi '+thisClass+' "  style="font-size:8px;padding:0px;" /> ';
         }
         stuff+='</span>';
      }

//      stuff=stuff+' <span class="ws_moveButtonSW"> <input type="button" value="&swarr;" id="resizeSW_'+ncreated+'"  title="Click, and hold, to reize" class="xws_moveButtonSW ws_moveButtonSWi '+thisClass+' "  /></span>  ';
       if (noResizer!='2')   {
         stuff=stuff+'  <span  class="ws_moveButtonSE"> ';
          if (noMover==4) {
            stuff=stuff+'<input type="button" value="'+moveIcon+'"  name="ws_moveButton_'+ncreated+'"  title="Click, and hold, to move"  class="ws_Control  ws_moveButtonSEi '+thisClass+' "  style="font-size:8px;padding:0px;" /> ';
          }
          stuff+='<input type="button" value="&searr;" id="resizeSE_'+ncreated+'" title="Click, and hold, to reize"  class="ws_Control  ws_moveButtonSEi '+thisClass+' "  /> ';
          stuff+='</span>';
       }
   }
   d1.append(stuff);

   dacloser='closeMe_'+ncreated  ;
   if (noCloser=='1') dacloser='0';
   damover='ws_moveButton_'+ncreated;
   if (noMover=='1') damover='0';
   daz='zindexUp_'+ncreated ;
   if (zIndexShow==0)   daz='0';
   if (noResizer=='1' || noResizer=='2') {
      z1=ws_Setup2(aid,damover,'resizeNE_'+ncreated+'=NE ',dacloser,'moveable box',daz);
//      z1=ws_Setup(aid,damover,'0, 0, 0','0','moveable box',daz);
   } else {
      z1=ws_Setup2(aid,damover,'resizeNW_'+ncreated+'=NW resizeNE_'+ncreated+'=NE resizeSE_'+ncreated+'=SE resizeSW_'+ncreated+'=SW',dacloser,'moveable box',daz);
   }


  let d1h=d1.find('.ws_moveButton_tipsButton');
 
  if (d1h.length>0) d1h.on("click",ws_desc);
  let d1hb=d1.find('.ws_tips_closer');
  if (d1hb.length>0) d1hb.on("click",ws_desc);
  let d1hc=d1.find('.ws_buttonViewIcon');
  if (d1hc.length>0) d1hc.on("click",ws_es_buttons);
  let d1hd=d1.find('.ws_moveButton_restoreSizeButton');
  if (d1hd.length>0) d1hd.on("click",ws_DoResize);


   if (expandBox==1) {
     tt=z1.find('#viewFull_'+ncreated);
     tt.on('mouseup',{'idP':z1},ws_DoExpand);

     tt.css({'cursor':'pointer'});
   }

   if (callFunc!=='') {
     tt=z1.find('#callFunc_'+ncreated);
     tt.on('click',ws_CallFunc);
     tt.css({'cursor':'pointer'});
   }

   if (returnJquery!=1)  return 1;
   return d1 ;  // the jquery object of this moveBox

 }  // input


//============================
// uncreate --- remove ws_ attributes from a moveBox
// e1 is either a jqauery objet, or string id
function ws_Remove(e1) {
   if (typeof(e1)=='string') {       // if string, try to find id that matches
        if (e1.substr(0,1)!='#') e1='#'+e1;
        let e2=$(e1);
        if (e2.length ==0) {
            alert('ws_Remove error: no such id: '+e1);
            return 0;       // no such id
        }
        e1=$(e2[0]) ;     // first element that matches
   } else {
       e1=ws_moveArg(e1);
   }
   if (!e1.hasClass('ws_moveBox')) {
            alert('ws_Remove error: '+e1.attr('id')+' is not a moveBox');
            return 0;       // no such id

   }
   let oldclass=e1.attr('oldclass');
   e1.removeClass()  ;              // remove all old classes
   if (typeof(oldclass)!='undefined')  e1.addClass(oldclass)  ; // restore prior classes
   e1.removeAttr('style ws_positionoriginal  oldclass ws_escapeorder escindex');
   let e1c=e1.find(".ws_Control");
   e1c.remove();
//   alert('removed!!!');
  return 1;
}

//========================
// resize (or move) a movebox
// specs fields: 'top' : top of box (% or px, or em).
//              'left' : left of box (% or px, or em)
//              'width':  width of box (% of px, or em)
//              'height':  height of box (% of px, or em)
// specs =0 : return  current position {'left':currentLeft,'top':currentTop,'height':currentHeight,'width':currentWidth}
// specs ='L' : return  latest position {'left':currentLeft,'top':currentTop,'height':currentHeight,'width':currentWidth}
//  specs ={}  : return original
//   = 'R'   : restore to original size
// itest=1 : return where the positon would be after a more.
function  ws_DoResize(specs,e1,itest) {
    var cc,specsLatest,latestCurPos ;
    if (arguments.length<3) itest=0;

 // find the move box -- if no such luck, return 0
   if (arguments.length==0) {
      e1=$('.ws_moveBox');
      if (e1.length==0) return 0       ; // no such box, giveu p
      if (e1.length>0) e1=$(e1[0]);  //  first element in this class
   }

   if (arguments.length==1) {
      let ethis=ws_moveArg(specs);
      e1=ethis.closest('.ws_moveBox');
      let ado=ethis.attr('how');
      if (typeof(ado)!=='undefined') {
          let aspecs=$.trim(ado);
          if (aspecs.substr(0,1)=='R') {
            specs='R';
          } else {
            let aspecsV=aspecs.split(',');
            specs={};
            for (let ia=0;ia<aspecsV.length;ia++) {
                let aspecsV1=$.trim(aspecsV[ia]);
               let cc=aspecsV1.split(':');
               specs[cc[0]]=$.trim(cc[1]);
            }
         }
      } else {
          specs='R' ;    //default is rsestore (if no how attribute)
      }
   }

// what move box to play with --- arg specified, or default found
   if (typeof(e1)=='string') {       // if string, try to find id that matches
        if (e1.substr(0,1)!='#') e1='#'+e1;
        let e2=$(e1);
        if (e2.length ==0) {
            alert('ws_DoResize error: no such id: '+e1);
            return 0;       // no such id
        }
        e1=$(e2[0]) ;     // first element that matches
   } else {
       e1=ws_moveArg(e1);
   }

   if (!(e1 instanceof jQuery))  return 0 ; // probabliy overkill
   if (!e1.hasClass('ws_moveBox')) return 0 ;  // not a move box container. give up

//  found the move box. get some attributes

   let origPos= e1.attr('ws_positionOriginal');
   if (typeof(origPos)=='undefined') {
      alert('Error in movebox: no ws_positionOriginal. '+e1.attr('id'));
      return 0;
   }
   let latestPos= (typeof(e1.attr('ws_positionLatest'))!='undefined') ?   e1.attr('ws_positionLatest')  :   origPos ;

// special cases (return a position)
   if (!$.isPlainObject(specs)  || $.isEmptyObject(specs)  ) {
      if ($.isPlainObject(specs) &&  $.isEmptyObject(specs) ) specs='O';
      let s0=$.trim(specs).toUpperCase();
      let s1=s0.substr(0,1);
      if (s1=='0' || s1=='C')  {       // get current position
         let awide=e1.width();
         let aheight=e1.height();
         let gooD1=e1.offset();                       // upper left of the alert box
         let atop=gooD1.top;
         let aleft=gooD1.left;
         let info1={'top':atop,'left':aleft,'height':aheight,'width':awide};
         return info1;
      }
      if (s1=='L' || s1=='O')  {       // get latest or origional position call
         let info1={'top':0,'left':0,'height':0,'width':0};
         let usePos= (s1=='L') ? latestPos : origPos ;
         let ccs=usePos.split(',');           // starting position is "originaL"
         jQuery.each(ccs,function(ii,vv) {                         // since we assubme  ws_positionOriginal  (or ws_positionLatest) is available and properly formatted
            let cc2=vv.split('=');
            let aspec=jQuery.trim(cc2[0]).toLowerCase();
            if (aspec=='pct' || aspec=='position') return  ;  // dealt with above
            if (typeof(info1[aspec])=='undefined' ) {             // should NEVER happen
               alert('Error in ws_DoResize: improper ws_position attribute: '+aspec);
               qerr=true;
               return 0;
            }
            info1[aspec]=cc2[1];
         });
         return info1 ;
      }
      
      if (s1=='R') {
          specs={'left':'+0'} ;  // used below
      } else {
          return  0   ; // unsupported special call
      }

   }            // special calls


// found a move box. Get current "original" position (not necessarily the user changed one)

   specsLatest= (specs.hasOwnProperty('latest')) ? parseInt(specs['latest']) : 0 ; ; // 0=percent of origina, 1=percent of latest size.

   if (specsLatest==1) {
       cc=latestPos.split(',');      // starting position is "latest" (which might be the original, if this is first 'latest' call)
   } else {
       if (specsLatest==2) {
          e1.attr('ws_positionLatest',origPos);  // reset "latest" position (back to original)
       }
       cc=origPos.split(',');           // starting position is "originaL"
   }


   let qerr=false;
   let info1={'top':0,'left':0,'height':0,'width':0};
   jQuery.each(cc,function(ii,vv) {  // parse out "base position" (original or latest)
       let cc2=vv.split('=');
       let aspec=jQuery.trim(cc2[0]).toLowerCase();
       if (aspec=='pct' || aspec=='position') return  ;  // dealt with above
       if (typeof(info1[aspec])=='undefined' ) {             // should NEVER happen
             alert('Error in ws_DoResize: improper ws_DoResize attribute: '+aspec);
             qerr=true;
             return 0;
       }
       let acc2=parseInt(cc2[1]);
       info1[aspec]=[acc2,acc2] ;    // [startPos,postMovePos] , with
   });
   if (qerr)  return 0 ;  //  error

   let bodyFontSize=$("body").css('font-size');
   let awidth=$(document).width(),newvalUse;
   let aheight=$(document).height();
   for (let aspec in specs) {                // what are the change?
       let aspecC=jQuery.trim(aspec).toLowerCase();
       if (typeof(info1[aspecC])=='undefined') continue ;  // ignore if unknown speci
       let newval=jQuery.trim(specs[aspecC]);
       newvalUse= ws_toPx_resize(newval,aspecC,info1,bodyFontSize,awidth,aheight);
       info1[aspecC][1]=newvalUse   ;
  }
  let stuff={'position':'fixed'};
  for (aspec0 in info1) {
        stuff[aspec0]=info1[aspec0][1]+'px';  // the new value
   }
   if (itest!=1) {   // NOT a just compute
      e1.css(stuff);
      if (specsLatest==1 ) {
         let thelatest=[];
         for (let arf in stuff) thelatest.push(arf+'='+stuff[arf]);
         let thelatestSay=thelatest.join(',');
         e1.attr('ws_positionLatest',thelatestSay);
      }
   }
   return info1 ;

 }

//----------------
// private function to compute new px size given old size and a change
// uses output from  ws_DoResize
function  ws_toPx_resize(newval,aspec,info1,bodyFontSize,awidth,aheight) {
  let ischange=0,  dasize;

 if (arguments.length<4) bodyFontSize=$("body").css('font-size'); // thse are subject to change (so not stored in ws_ object
 if (arguments.length<5)   awidth=$(document).width();
 if (arguments.length<6)   aheight=$(document).height();

 let aspecC=jQuery.trim(aspec).toLowerCase();

  if (newval.substr(0,1)=='-') {
     ischange=-1 ;
     newval=newval.substr(1);
  } else if (newval.substr(0,1)=='+') {
     ischange=1;
     newval=newval.substr(1);
  }
  if (aspecC=='height' || aspecC=='top') {
     dasize= (ischange==0) ? aheight : info1[aspecC][0] ;  // use the old height?
  } else  {
     dasize= (ischange==0) ? awidth : info1[aspecC][0] ;  // use the old width?
  }

 let newval2=ws_toPx(newval,dasize,bodyFontSize) ;
    if (isNaN(newval2)) return  info1[aspecC][0];

  if (ischange!=0) {       // if not a number retaincurren value (as initialize above)
       newval3=info1[aspecC][1]+ (ischange*newval2);
 } else {
       newval3= newval2;
 }
 return newval3;
}

///===== might be useful elsewhere!
 function ws_toPx(aa,asize0,bodyFontSize) {
     if (arguments.length<2) asize0= ($(document).width()+ $(document).height() ) / 2; // a compromise
     if (arguments.length<3) bodyFontSize=$("body").css('font-size');

      var asize=parseFloat(asize0);
      aa=jQuery.trim(aa).toUpperCase();
      if (aa.indexOf('PX')>-1) return parseInt(aa);
      if (aa.indexOf('%')>-1) return (parseInt(parseInt(aa)*asize/100)) ;
      if (aa.indexOf('EM')>-1) return (parseInt(aa)*parseInt(bodyFontSize)) ;
      return parseInt(aa);
 }

//----------------
// esc handler for moveBox -- close "most recently created" boxes first
// somewhat deprecated. Recommedn use of ws_escapeHandler insteadl
function ws_doEsc(evt) {

  var e1,akey,ee,use1,nowtime,atime=-11111111111111111111;
  e1=$(evt.target);
  akey=evt.which ;
  if (akey!==27) return '';
  ee=$('.ws_:visible');
  if (ee.length==0) return ;
  use1=0;
  atime=parseInt($(ee[0]).attr('ws_EscapeOrder'));
  for (ii=1;ii<ee.length;ii++) {
    nowtime=parseInt($(ee[ii]).attr('ws_EscapeOrder'));
    if (nowtime>atime) {
        atime=nowtime;
        use1=ii;
    }
  }
  $(ee[use1]).hide();
  evt.stopImmediatePropagation();    // if a box closed, don't do any other esc handlers


}

//=======
//  Used by _create.
// Initialize a moveable box. This will add .data to the element (the box) with an id of aid
// Called by public function: ws_Create
// aid: the ID of the box to be moved
//  moveid: the id(s) (space delimited) of the "move button(s)". This is typically in the box to be moved, but can be anywhere
//  resizeid: the id(s) of the "resize button(s)". This is typically in the box to be moved, but can be anywhere
//  closeid: the id of the "close button"
// acomment: comment to add to the data object (possibly useful for debugging)
// Note: moveid, resizeid, and closeid can be also be '1' (create a default in upper right corner) or '0' (do not create)

function ws_Setup2(aid,movename,resizeid,closeid,acomment,zupid) {
 var z,dd,z2,z3,im,z2x=[],z3x=[],z4x=[],addtmp0=0,tmp1,tmp0,z3xWhere=[],resizeCursor;
var resizeIds,resizewhere,mm,foo,az3x,z5up,z5down;

 if (arguments.length<5) acomment='moveable box';

 z=ws_Setup_jq(aid,'setupMoveBox [moveable box id]')[0];         ; // abort on error -- otherwise return jQuery object of the moveabel box
 dd={_firstMouseX:0,_firstMouseY:0,_nowMouseX:0,_nowMouseY:0,_startingAtX:0,_startingAtY:0,
          _startingAtW:0,_startingAtH:0,_resizeWhere:'NE',
          _firstRMouseX:0,_firstRMouseY:0,_nowRMouseX:0,_nowRMouseY:0,_startingRAtX:0,_startingRAtY:0}   ;
  dd.comment=acomment ;
  z.data('vars',dd);

   goo=z.css('position');
   if (goo.toUpperCase()=='STATIC') z.css('position','relative');   // moves won't work if static position
   goo=z.css('position');

   tmp0=$('<span  class="ws_ButtonsUpperRight"></span>');

   if (arguments.length<2) movename='1';

//  make  default movebutton?
   if (jQuery.trim(movename)=='1') {
      addtmp0=1;
      tmp1=$('<input type="button" class="ws_Button" title="click and hold to move" value="&#9678;" />');
      tmp0.append(tmp1);
      z2x[0]=tmp1;
    } else if (jQuery.trim(movename)=='0') {
       // do nothing -- z3x will be empty array
   } else {
       if (jQuery.trim(movename)!=='0') z2x=$('[name="'+movename+'"]');
   }


   if (arguments.length<3) resizeid='1';

   if (jQuery.trim(resizeid)=='1') {
      addtmp0=1;
      tmp1=$('<input type="button" class="ws_Button" title="click and hold to resize" value="&varr;" />');
      tmp0.append(tmp1);
      z3x[0]=tmp1; z3xWhere[0]=['NE','ne-resize'];
    } else if (jQuery.trim(resizeid)=='0') {
       // do nothing -- z3x will be empty array
   } else {
//      resizeIds=getWord(resizeid);
      resizeIds= resizeid.split(/\s+/);
      for (var mm=0;mm<resizeIds.length;mm++) {
          resizeid=resizeIds[mm];
          if (resizeid.indexOf('=')>-1) {
             foo=resizeid.split('=');
             resizeWhere=jQuery.trim(foo[1]).toUpperCase();
             if (resizeWhere=='LR' || resizeWhere=='SE') { resizeWhere='SE'; resizeCursor='se-resize' };
             if (resizeWhere=='UR' || resizeWhere=='NE') { resizeWhere='NE'; resizeCursor='ne-resize'}  ;
             if (resizeWhere=='LL' || resizeWhere=='SW') { resizeWhere='SW'; resizeCursor='sw-resize'} ;
             if (resizeWhere=='UL' || resizeWhere=='NW') { resizeWhere='NW'; resizeCursor='nw-resize'};
             resizeid=jQuery.trim(foo[0]);
         }    else {
               resizseid=jQuery.trim(resizeid); resizeWhere='NE'; resizeCursor='ne-resize;'
         }
         az3x=ws_Setup_jq(resizeid,'setupMoveBox [a resize button id]')         ; // abort on error
         z3x.push(az3x[0]); z3xWhere.push([resizeWhere,resizeCursor]);
      }                  // mm
   }                 // resizeid =1,0, other

   if (arguments.length<4 || jQuery.trim(closeid)=='1') {
      addtmp0=1;
      if (jQuery.trim(closeid)!=='0')  tmp1=$('<input type="button" class="ws_Button" title="click to close" value="&Chi;" />');
      tmp0.append(tmp1);
      z4x[0]=tmp1;
    } else if (jQuery.trim(closeid)=='0') {
       // do nothing -- z4x will be empty array

   } else {
       z4x=ws_Setup_jq(closeid,'setupMoveBox [close button id]')         ; // abort on error
   }



 if (addtmp0==1) z.append(tmp0);               // add span with buttons in it

 for (im=0;im<z2x.length;im++) {                   // enable the move button
  $(z2x[im]).on('mousedown',{'stuff':z},ws_DoStartMove);               // data contains the jquery object of the moveable box
  $(z2x[im]).css({'cursor':'move'});
 }

 for (im=0;im<z3x.length;im++) {   // enable the resize buttons
   var t5 ;
   t5=z3xWhere[im];
   z3x[im].on('mousedown',{'stuff':z,'how':t5[0]},ws_DoStartResize) ;
   z3x[im].css({'cursor':t5[1]});
 }

 for (im=0;im<z4x.length;im++) {                                      // enable the close buttons
     z4x[im].on('mousedown',{'stuff':z},ws_DoClose) ;
    z4x[im].css({'cursor':'pointer'});
 }

// note: no auto create of zindex buttons
  if (arguments.length>5) {
       if (jQuery.trim(zupid)!=='0') {        // zindex up (foreground)
           z5up=ws_Setup_jq(zupid,'setupMoveBox [z up button id]')[0]  ; // abort on error
           z5up.on('click',{'dire':1},ws_DoZindex) ;
           z5up.on('contextmenu',{'dire':-1},ws_DoZindex) ;  
          z5up.css({'cursor':'pointer'});
       }
  }



 return z;           // return jquery object of the the moveable box element

///====
//return jquery object
function ws_Setup_jq(a1s0,amess) {

  var a1st,im,ado,a1s=[],emptyok=0;

  if (arguments.length<2) amess='error ';

  if (a1s0 instanceof jQuery) {        // already a jquery object
     a1s[0]=a1s0 ;
     return a1s ;
  }

  if (typeof(a1s0)=='string') {       // list of ids
   a1st=a1s0.split(/[\s\,]+/);
   for (var im=0;im<a1st.length;im++) {
      ado=$('#'+a1st[im]);
      if (ado.length==0){
           throw new Error('This is not a javascript coding error -- javascript: could not find id '+a1st[im]+' ['+amess+']');
      }
      a1s[im]=ado ;
    }
    return a1s ;
 }

 if ($.isArray(a1s0)) {                      // an array (may contain id strings, dom objects, or jquery objects
      for (im=0;im<a1s0.length;im++) {
        if (typeof(a1s0[im])=='string') {       // string id
            ado=$('#'+a1s0[im]);
            if (ado.length==0) {
                if (emptyok==1) return [] ;
                throw new Error('This is not a javascript coding error -- javascript: could not find id '+a1st[im]+' ['+amess+']');
            }
            if (just1=='1') return ado ;
        } else {
            ado=$(a1s0[im]);
        }
        a1s[im]=ado ;
      }
      return a1s;

    }

    ado=$(a1s0);   // assume is a dom object
}

}


//=======
//  close button event
// This is typically used as the "close button" handler (the button automatcially added to containers by ws_Create
// IN those cases, one argument is provided (e), and e.data contains further information (ie.; hide or close)
// However, this can be called as a standalong function, in which case
//  1 arg: event handler -- the jquery object is in the evt.data
//  2 arg version:
//     -- first arg is a string:
//           hide: retain state of show buttons and expander
//           visible: return 0/1 (is container visible)
//           open or show : display the move box
//           otherwise: show all the control buttons, unexpand , and then hide
//   -- 2nd arg is the jquery object for this move box (i.e.; something with a ws_ class)
//          Or a string containing id of contaier (the MUST be a movebox). Can start with a #  (doesn't have to)
//

function ws_DoClose(e,e2){
  var todo='close',jqobj;
   var foo4,foo5 ;

   if (arguments.length>1) {       // standalone function call
     if (typeof(e2)=='string')  {
          let e2a=e2.substr(0,1);
          if (e2a!='#') e2='#'+e2;
          jqobj=$(e2);
          if (jqobj.length!=1) {
              alert('ws_DoClose error: unable to find: '+e2);
              return 0;
          }

     } else {    // not a string. A jquery object or a "this"
         jqobj=ws_moveArg(e2);
     }
     if (!jqobj.hasClass('ws_moveBox')) {
           alert('ws_DoClose error: container is not a moveBox: '+e2);
              return 0;
    }
    todo=e.toLowerCase();
//    if (jQuery.trim(e).toUpperCase()=='HIDE') todo='hide';

  } else {              // single arg (typically: as specified by ws_Create

     jqobj=e.data.stuff ;
     if (e.which==3) todo='hide'   // rmb?
  }

  if (todo=='visible') {
       if (jqobj.is(':visible')) return 1;
       return 0;
  }
  if (todo=='open' || todo=='show') {
       jqobj.show();        // show as is (content, buttons, are not changed)
       return 0;
  }
  if (todo=='toggle' ) {
       jqobj.toggle();        // show as is (content, buttons, are not changed)
       return 0;
  }

  if (todo=='close') {
      ws_DoExpand(jqobj,0);   // unexpand
  }
  if (todo=='close') ws_es_buttons(jqobj,'SHOW') ;  // unhide the several actions button (in ne corner)
  if (todo=='close') jqobj.hide();
   return 0;
}

//===============
// event handler for user specified close button -- closes the move box that is the buttons parent
// if parent is not a move box, error
// This simple version of ws_DoClose -- it is meant to be used in additon close buttons that are specified inside of the moveable box
//  -- rather than  close buttons created by ws_Create close buttons created
// Note that the event handler can be assigned using inline  ala onClick="wsMoveBox.ws_Close(this)"); or jquery ala:$('#myCloseButton').on('click',wsMoveBox.ws_Close)
function ws_Close(athis) {
   let e2=ws_moveArg(athis);
   let e3=e2.closest('.ws_moveBox');
   if (e3.length==0)  {
       alert('ws_Close error: parent container is not a moveBox: ' );
       return 0;
  }
  ws_DoExpand(e3,0);   // unexpand
  e3.hide();  
  return 1;
}

//=======
// initialize move button(s)
function ws_DoStartMove(e) {

   var boxid, firstMouseX,firstMouseY, nowMouseX, nowMouseY, startingAtX, startingAtY ;
   var jqobj,ovars, tmpx, tmpy,apos,foo,goo,stuff;
   var innerWidthW, innerHeightW ;

   jqobj=e.data.stuff ;
   ovars=jqobj.data('vars');

    tmpx=e.pageX  ;  tmpy=e.pageY ;

    firstMouseX= tmpx;  firstMouseY= tmpy ;
    nowMouseX= tmpx;  nowMouseY= tmpy ;

    startingAtX=jqobj.css('left');
    startingAtY=jqobj.css('top');

   innerWidthW=$(window).innerWidth();
   innerHeightW=$(window).innerHeight();

    if ( startingAtX.indexOf('%')>-1) {                    // % (not px)
           startingAtX=parseInt(parseInt( startingAtX)*innerWidthW/100) ;
    }   else {
        if ( startingAtX=='')  startingAtX= firstMouseX ;
        startingAtX=parseInt( startingAtX);
    }
    if ( startingAtY.indexOf('%')>-1) {
           startingAtY=parseInt(parseInt( startingAtY)*innerHeightW/100) ;
    }   else {
        if ( startingAtY=='')  startingAtY= firstMouseY ;
         startingAtY=parseInt( startingAtY);
    }

   ovars._firstMouseX=firstMouseX;ovars._firstMouseY=firstMouseY;
   ovars._nowMouseX=nowMouseX,ovars._nowMouseY=nowMouseY
   ovars._startingAtX=startingAtX,ovars._startingAtY=startingAtY;
   jqobj.data('vars',ovars);

  $(':root').on('mouseup',{'stuff':jqobj},ws_XYatEnd);   // mouseup or mousemove AFTER clicking this will invoke these handlers (anywere in docuhemt0
  $(':root').on('mousemove',{'stuff':jqobj},ws_XYMove);
  return 0;
}

//=================================
//  moves box after a mouse move (_boxid is global). Note use of event passed by jquery 'mouse move" handler (that contains x and y position)
function ws_XYMove(e) {
 var t1,t2,dx,dy,tmpx,tmpy;
 var nowMouseX,nowMouseY,firstMouseX,firstMouseY,startingAtX,startingAtY;
 var ovars,jqobj;

 jqobj=e.data.stuff ; ovars=jqobj.data('vars');                          // retrieve pointer to jquery object of the moveable box, and extract location data
 jqobj.addClass('ws_NoSelect');

 nowMouseX=ovars._nowMouseX ; nowMouseY=ovars._nowMouseY ;
 tmpx=e.pageX  ; tmpy=e.pageY ;

 if (Math.abs(tmpx-nowMouseX)<3 && Math.abs(tmpy-nowMouseY)<3) return 0 ; // small move, ignore

 firstMouseX=ovars._firstMouseX ; firstMouseY=ovars._firstMouseY ;            // get location of "first mouse click"  (which might be anywhere)
 startingAtX=ovars._startingAtX ; startingAtY=ovars._startingAtY ;             // get location of original left corner of moveable box

  dx=tmpx-firstMouseX ;                                                       // the displacement of current location to first moust click
  dy=tmpy-firstMouseY ;

  t1=(startingAtX +dx);                                                           // position set using original corner, and the displacement
     jqobj.css('left',t1);
  t2=(startingAtY+dy);
     jqobj.css('top',t2);

  ovars._nowMouseX =tmpx ;   ovars._nowMouseY =tmpy ;        // save location of "last time location queried"
  jqobj.data('vars',ovars);

  return 0;
}

//=================================
// on mouse up, at the end of a move or a resize, release the mouseup and mousemove events handlers from the document
// if I was clever, I would reestablish a prior mouseup and mousemove (that may have beem overwritten by startMove...
function ws_XYatEnd(e) {
   var jqobj=e.data.stuff ;
   jqobj.removeClass('ws_NoSelect');
  $(':root').off('mouseup mousemove');
  return 0;
}

// ============= END OF MOVE-A-BOX FUNCTIONS ==================

// resize versions of move
//==============================
// resize button
function ws_DoStartResize(e) {

  var apos,foo,tmpx,tmpy,jqobj,ovars;
  var innerWidthW,innerHeightW;
  var firstRMouseX,firstRMoustY,nowRMouseX,nowRMouseY,startingRAtX,startingRAtY,startingAtW,startingAtH,rwhere;

  tmpx=e.pageX  ; tmpy=e.pageY ;
  jqobj=e.data.stuff ;
  ovars=jqobj.data('vars');
  rwhere=e.data.how;
  innerWidthW=$(window).innerWidth();
  innerHeightW=$(window).innerHeight();

  firstRMouseX=tmpx;  firstRMouseY=tmpy ;
  nowRMouseX=tmpx;  nowRMouseY=tmpy ;

  startingRAtX=jqobj.css('left');
  startingRAtY=jqobj.css('top');

  if (startingRAtX.indexOf('%')>-1) {                    // % (not px)
        startingRAtX=parseInt(parseInt(startingRAtX)*innerWidthW/100) ;
    }   else {
        if (startingRAtX=='') startingRAtX=firstRMouseX ;
       startingRAtX=parseInt(startingRAtX);
    }
    if (startingRAtY.indexOf('%')>-1) {
          startingRAtY=parseInt(parseInt(startingRAtY)*innerHeightW/100) ;
    }   else {
        if (startingRAtY=='') startingRAtY=firstRMouseY ;
        startingRAtY=parseInt(startingRAtY);
    }

   startingAtH=jqobj.css('height');
         if (startingAtH=='') startingAtH='15%' ; // an arbitrary value
   startingAtW=jqobj.css('width');
         if (startingAtW=='') startingAtW='55%' ; // an arbitrary value
    if (startingAtH.indexOf('%')>-1) {                    // % (not px)
          startingAtH=parseInt(parseInt(startingAtH)*innerHeightW/100) ;
    }   else {
       startingAtH=parseInt(startingAtH);
    }
    if (startingAtW.indexOf('%')>-1) {
          startingAtW=parseInt(parseInt(startingAtW)*innerWidthW/100) ;
    }   else {
        startingAtW=parseInt(startingAtW);
    }

   ovars._firstRMouseX=firstRMouseX;ovars._firstRMouseY=firstRMouseY;
   ovars._nowRMouseX=nowRMouseX,ovars._nowRMouseY=nowRMouseY
   ovars._startingRAtX=startingRAtX,ovars._startingRAtY=startingRAtY;
   ovars._startingAtW=startingAtW,ovars._startingAtH=startingAtH;
   ovars._resizeWhere=rwhere ;
   jqobj.data('vars',ovars);

  $(':root').on('mouseup',{'stuff':jqobj},ws_XYatEnd);   // mouseup or mousemove AFTER clicking this will invoke these handlers (anywere in docuhemt0
  $(':root').on('mousemove',{'stuff':jqobj},ws_XYResize);


  return 0;
}





//=================================
// resizes or moves box after a mouse move (_boxid is global)
// resizeWhere=SE -- resize moves se corner of box to  (or away) from se corner of screen
// otherwise, towards ne corner
function ws_XYResize(e) {

  var t1,t2,dx,dy,tmpx,tmpy,endHeight,endWidth;
  var firstRMouseX,firstRMoustY,nowRMouseX,nowRMouseY,startingRAtX,startingRAtY,startingAtW,startingAtH;
  var jqobj,ovars,resizeWhere2;
  jqobj=e.data.stuff ;
  ovars=jqobj.data('vars');
  resizeWhere2=ovars._resizeWhere;

  nowRMouseX=ovars._nowRMouseX ;  nowRMouseY=ovars._nowRMouseY ;


  tmpx=e.pageX  ; tmpy=e.pageY ;
  if (Math.abs(tmpx-nowRMouseX)<3 && Math.abs(tmpy-nowRMouseY)<3) return 0 ; // small move, ignore

  nowRMouseX=tmpx; nowRMouseY=tmpy  ;

 firstRMouseX=ovars._firstRMouseX ; firstRMouseY=ovars._firstRMouseY ;            // get location of "first mouse click"  (which might be anywhere)
 startingRAtX=ovars._startingRAtX ; startingRAtY=ovars._startingRAtY ;             // get location of original left corner of moveable box
 startingAtH=ovars._startingAtH ; startingAtW=ovars._startingAtW ;             // get location of original left corner of moveable box

  dx=parseInt(nowRMouseX)-parseInt(firstRMouseX) ;
  dy=parseInt(nowRMouseY)-parseInt(firstRMouseY) ;        // else, move it by dx and dy where it was a click

  if (resizeWhere2=='SE') {
       endHeight=parseInt(startingAtH)+dy;
       endWidth=parseInt(startingAtW)+dx;

  } else if (resizeWhere2=='NW') {
    endHeight=parseInt(startingAtH)-dy;
    endWidth=parseInt(startingAtW)-dx;
    t2=parseInt(startingRAtY)+dy;    // move up (-dy moves up).But don't move x location of upper left corrner (ULC)
    jqobj.css('top',t2);
    t2=parseInt(startingRAtX)+dx;    // move up (-dy moves up).But don't move x location of upper left corrner (ULC)
    jqobj.css('left',t2);

  } else if (resizeWhere2=='SW') {
    endHeight=parseInt(startingAtH)+dy;
    endWidth=parseInt(startingAtW)-dx;
//    t2=parseInt(startingRAtY)-dy;    // move up (-dy moves up).But don't move x location of upper left corrner (ULC)
//    jqobj.css('top',t2);
    t2=parseInt(startingRAtX)+dx;    // move up (-dy moves up).But don't move x location of upper left corrner (ULC)
    jqobj.css('left',t2);


  } else {                                             // default is NE (move upper right corner toward NE
    t2=parseInt(startingRAtY)+dy;    // move up (-dy moves up).But don't move x location of upper left corrner (ULC)
    jqobj.css('top',t2);
    endHeight=parseInt(startingAtH)-dy;
    endWidth=parseInt(startingAtW)+dx;
  }

//    endHeight=parseInt(startingAtH)-dy;

    jqobj.css('height',endHeight);
    jqobj.css('width',endWidth);

  ovars._nowMouseX =tmpx ;   ovars._nowMouseY =tmpy ;        // save location of "last time location queried"
  jqobj.data('vars',ovars);


return 0;
}

//============
// change z index
// one arg mode: called as event manager (the doZindex button
// 2 args: e=is jquery object, or string pointing to,
//  idire: 1: move to foreground (of moveboxes), -1: move tobackground
// Caution:  moveboxes that are inside of different containers don't get moved relative to each other.
//    THus: moveboxe should always be direct children of the document
function ws_DoZindex(e,idire) {
   var atmp,tmp,ii,avals=[],minZind=11111111111; maxZind=-11111111111111 ;;
   var e1,e2,newZind;
   if (arguments.length<2) var idire=e.data['dire'];

   if (arguments.length>1) {
       if (typeof(e)=='string')  {
           if (e.substr(0,1)!='#' ) e='#'+e;
           e2=$(e);
           if (!e2.hasClass('ws_moveBox')) {
               alert('ws_DoZindex error: container ('+e+') is not a move box');
               return 0;
           }
       } else {
           e2=ws_moveArg(e);
       }

   } else {     // event handler of the BUTTON (not the move box container) call (i.e. onclick="wsMoveBox.ws_DoZindex(this)"
       e1=ws_moveArg(e);
       e2=e1.closest('.ws_moveBox');

   }

   tmp=$('.ws_moveBox');

   for (ii=0;ii<tmp.length;ii++) {
        atmp=$(tmp[ii]);
        zind =atmp.css('z-index');    // css also looks at stylesheets
        if (isNaN(zind) || zind=='' ) {
            zind=0;
            atmp.css({'zindex':1});
        }
        zind=parseInt(zind);
        avals.push(zind)  ;
        maxZind=Math.max(maxZind,zind);
        minZind=Math.min(minZind,zind);
   }
   if (idire==1) {
       newZind=maxZind+1;
       if (newZind<2) newZind=2;
       e2.css({'z-index':newZind});
   } else {
       newZind=Math.max(0,minZind-1) ;
       if (e=='#simulationArea') alert(' newzind ='+newZind);
       e2.css({'z-index':newZind});
   }
   //alert('newzindex '+newZind);
  return false ;

}

// ------------------------
// toggle to fullish scrren
//       aobject1['height']='94%' ;       aobject1['width']='94%' ;
//       aobject1['xoff']='2%' ;       aobject1['yoff']='2%' ;
// 20 march 2020: 
//   ido to force expand or unexpand. (1=expand,0=unexpand). e should be the movebox jquery object (with a ws_ class0
//   if  ido specified, e should  be the jquery object of the moveBox to be "expanded"

function ws_DoExpand(e,ido) {
  var e2,edata,iexpand,eparent,arf,doExpand=1 ;

  if (arguments.length>1) {
     if (typeof(e)=='string')  {
          let e2a=e.substr(0,1);
          if (e2a!='#') e='#'+e;
          jqobj=$(e);
          if (jqobj.length!=1) {
              alert('ws_DoExpand error: unable to find: '+e2);
              return 0;
          }
     }
     if (ido==0) doExpand=0;
     if (ido==2)  doExpand= (e.hasClass('ws_Expand')) ? 0  : 1 ;
 //    alert('odoo '+ido+','+doExpand);
     e2=e.find('[name="ws_expander"]');
     eparent=e    ;

  }   else {       // 1 argument
     e2=ws_moveArg(e);
     iexpand=e2.attr('expanded');
     if (iexpand==1) doExpand=0;         // toggle!
     edata=e.data;
     eparent=edata['idP'];     // does nto change
  }

    if (doExpand==1 ) {         // expand it!
        eparent.addClass('ws_Expand');
        e2.attr('expanded','1');
        e2.val('\u25a3');   // shrink button
    } else {
        eparent.removeClass('ws_Expand');
        e2.attr('expanded','0');
        e2.val('\ud83d\udd33');  // expand button
    }
    return 1;
}

//===========
// call a show in new window function (actually, it can do anything with content

function ws_CallFunc(e) {
   var e1,acontent,afunc,e2;
   e1=$(e.target);
   afunc=e1.attr('func');
   if (typeof(window[afunc])!='function') {
      alert('moveBox error: no such function: '+afunc);
      return 0;
   }
   e2=e1.parents('.ws_moveBox');
   window[afunc](e2);
}

//====================
// toggle view of the move box topOfContianter buttons (resize, maximize, close, etc). This is the small circle button hander
function ws_es_buttons(athis,whatdo) {
  var ethis,e2,e3;
  if (arguments.length>1)  {                 // explicit task, athis is jquery object of move box    (a container with a class of ws_
      whatdo=jQuery.trim(whatdo.toUpperCase());
      e2=athis.find('.ws_NEButtons');
  } else {
      whatdo='';
      ethis=ws_moveArg(athis) ;
      e2=ethis.closest('.ws_NEButtons');
  }
  e3=e2.find('.ws_Buttons_canHide');

  if (whatdo=='') {
       whatdo='SHOW';
       if (e3.is(':visible')) whatdo='HIDE';
  }

   if (whatdo=='HIDE') {
       e3.hide()
   } else {
      e3.show();
   }
   return 1;
}

///============
// return html string describing movebox controls
// optional first argument: string used for the 'move box"  "moveIcon" icon. For example:  '&#9995;' (a yellow palm). Default is '&#9769;'
// OR: a "this"  or evt  (used to find what box a "show tips" button is in
function ws_desc(athis) {
  var eh,e1,mess='',e0,eh2;
   if (arguments.length<1) athis='&#9995;';

  if (typeof(athis)=='string') {           // get all tips (with custom moveIcon)  -- return as string
    mess+='<em>moveable boxes</em> are used to display a variety of content. ';
    mess+='  These <tt>display containers</tt> can be manipulated by you, the end user,';
    mess+='    in a number of ways -- by clicking (or clicking and dragging) on buttons displayed in the corners! The possible actions include:';
    mess+='';
    mess+='<ul class="ws_moveButton_tipsUl" >';
    mess+='  <li><span style="cursor:move;border:1px solid black">'+athis+' </span> &nbsp; move the box... click, hold the mouse button down, move, and release.';
    mess+=' For some moveable boxes, you can also click-hold-move on the <span  style="cursor: move;background-color:#dbdbab;border:1px dotted gray">top border</span> ';
    mess+='  <li><span style="cursor: pointer;" >&#9195; </span> move the box to the foreground. Or right-mouse-click to move to the background. ';
    mess+=' ';
    mess+='  <li><span style="cursor: pointer;" >&#128307; </span>  expand the box to cover most of the window. Click again to restore to prior size.  ';
    mess+=' ';
    mess+='  <li><span style="cursor: pointer;border:1px solid black"> &neArr;  </span>&nbsp;  display the contents of the box in a new window';
    mess+='  <li><span style="cursor: pointer;border:1px solid black"> &Chi;  </span>&nbsp;  hide the box';
    mess+='  <li><span style="cursor: ne-resize;border:1px solid black"> &nearr; </span>&nbsp;  expand the box .. click, hold the mouse button down, move (to resize in that direction), and release';
    mess+='<br> the &searr;, &swarr;, and &nwarr; buttons can be used in similar fashion.    ';

    mess+='<li><span style="cursor: pointer;border:1px solid black" >&#65377;</span> toggle view of the moveable box control buttons. Click it again to re-display the buttons. ';

    mess+='<li><span  style="font-size:100%" class="ws_moveButton_restoreSizeButton" >&#10561;</span>Restore the moveable box to its original size and position.';
    mess+='<li><span  style="font-size:100%" class="ws_moveButton_tipsButton" >&#8505;</span> Display these tips.';

    mess+='  <li>If you hit the <tt>Esc</tt> key, these boxes will be hidden one-at-a-time.';
    mess+='</ul> ';
    return mess;
  }

// otherwise, write customized tip to header area if the specified box

  e0=ws_moveArg(athis) ;

  if (e0.length==0 ) {
         alert('ws_desc: not a moveable box ');
         return 1;
  }
  e1=e0.closest('.ws_moveBox')     ; // the parent of this button
  if (e1.length==0) {
          alert('ws_desc: not a moveable box! ');
         return 1;
  }

  eh=e1.find('[name="ws_showContent_headers"]');   // special case
  if (eh.length==0) eh=e1;  // no header area (not a show content!). So put at bottom of moveable box

// already being dispalyed? then remove
   eh2=eh.find('[name="ws_tips"]');
   if (eh2.length>0) {
      eh2.remove();
      return 0;
   }
   
  let aid=e1.attr('id');

// arent being displayed. Create customized tips
  mess+='<span title="Such as this moveable box: '+aid+'" style="border-bottom:1px dotted blue;font-style:oblique">moveable boxes</span> are used to display a variety of content. ';
  mess+='  These <tt>display containers</tt> can be manipulated by you, the end user,';
  mess+='    in a number of ways -- by clicking (or clicking and dragging) on buttons displayed in the corners!';
  mess+='';
  mess+='<ul class="ws_moveButton_tipsUl" >';

  let emove=e1.find('.ws_moveButton_icon') ;
  let icon1=emove.val();
  if (emove.length>0)  mess+='  <li><span style="cursor:move;border:1px solid black">'+icon1+' </span> &nbsp; move the box... click, hold the mouse button down, move, and release.';

  let emoveBar=e1.find('.ws_TopBar') ;
  if (emoveBar.length>0)           mess+=' You can also click-hold-move on the <span  style="cursor: move;background-color:#dbdbab;border:1px dotted gray">top border</span> ';

  let emoveZ=e1.find('.ws_ZindexUp') ;
  if (emoveZ.length>0)    mess+='  <li><span style="cursor: pointer;" >&#9195; </span> move the box to the foreground. Or right-mouse-click to move to the background. ';

  let emoveX=e1.find('.ws_Expander') ;
  if (emoveX.length>0)     mess+='  <li><span style="cursor: pointer;" >&#128307; </span>  expand the box to cover most of the window. Click again to restore to prior size.  ';

  let emoveF=e1.find('.ws_Callfunc') ;
  if (emoveF.length>0)   {
        let say1=emoveF.attr('title');
        mess+='  <li><span style="cursor: pointer;border:1px solid black"> &neArr;  </span>&nbsp; '+say1 ;
  }

  mess+=' ';

  let emoveCl=e1.find('.ws_Buttons_closerIcon') ;
  if (emoveCl.length>0)  mess+='  <li><span style="cursor: pointer;border:1px solid black"> &Chi;  </span>&nbsp;  hide the box';

  let emoveArr=e1.find('.ws_moveButtonNE') ;
  if (emoveArr.length>0) {
     mess+='  <li><span style="cursor: ne-resize;border:1px solid black"> &nearr; </span>&nbsp;  expand the box .. click, hold the mouse button down, move (to resize in that direction), and release';
     mess+='<br> &hellip; the &searr;, &swarr;, and &nwarr; buttons can be used in similar fashion.    ';
  }

  let emoveBv=e1.find('.ws_buttonViewIcon') ;
  if (emoveCl.length>0)   mess+='<li><span style="cursor: pointer;border:1px solid black" >&#65377;</span> Toggle view of the moveable box control buttons. Click it again to re-display the buttons. ';

  let emoveRestore=e1.find('.ws_moveButton_restoreSizeButton') ;
  if (emoveRestore.length>0)     mess+='  <li><span  style="font-size:100%" class="ws_moveButton_restoreSizeButton" >&#10561;</span>Restore the moveable box to its original size and position.';

  let emoveTip=e1.find('.ws_moveButton_tipsButton') ;
  if (emoveTip.length>0)     mess+='<li><span  style="font-size:100%" class="ws_moveButton_tipsButton" >&#8505;</span> Display these tips.';

  let emoveEsc=e1.attr('escIndex') ;
  if (typeof(emoveEsc)!=='undefined')   mess+='  <li>If you hit the <tt>Esc</tt> key, these boxes will be hidden one-at-a-time.';

  mess+='</ul> ';

   let acc='<input name="ws_tips_closer" type="button" style="font-size:80%;border-radius:3px" value="x" title="Close these movable box tips" > ' ;
   let mess2='<div name="ws_tips" style="border:1px dotted brown;margin:5px 2% 5px 3%">'+acc+ ' ' +mess+'</div>';
   eh.append(mess2);

  return 1;

}


//======
// returns jquery pointer to a dom object -- using argument sent to an event manager  attached said dom objecdt (several flavors)
function ws_moveArg(ado,which) {
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

    return {                                   // :::::::::::::::: returns public functions ::::::::::::::::;
      version:version,
      ws_Create:ws_Create,
      ws_Remove:ws_Remove,
      ws_DoClose:ws_DoClose,
      ws_Close:ws_Close,
      ws_DoResize:ws_DoResize ,
      ws_DoZindex:ws_DoZindex,
      ws_DoExpand:ws_DoExpand,
      ws_toPx:ws_toPx,
      ws_doEsc:ws_doEsc,
      ws_Close:ws_Close,
      ws_desc:ws_desc
   }


}();