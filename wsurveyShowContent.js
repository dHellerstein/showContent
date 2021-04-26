// The ws_showContent library
// Used ws_moveBoxes.js
// last modified: 23 jan 2021

//=================
// create a few css rules  -- do this here so you don't need to require a <style>
$('<style>').prop("type","text/css")
 .html(" \
.ws_showContent_mainC {position:fixed;opacity:1.0;left:10%;top:10%;width:70%;height:50%;  \
                           overflow:visible;  \
                           margin:5px 5px 3em 5px;  \
                           padding:3px 3px 2.5em 3px;\
                           border:2px solid gold;   \
                           border-bottom:2px dotted #989799; \
                           background-color:#ededed;border-radius:5px;z-index:50 ;}   \
.ws_showContent_shadow {box-shadow: 20px 20px 30px 20px tan ;} \
.ws_showContent_contentC {border:1px dotted #ababbb;xborder-right:none;;height:96%;width:99%;overflow:auto} \
.ws_showContent_headersC  {background-color:#dfdedf;min-height;0.5em; font-size:70%;margin-top:3px} \
.ws_showContent_maximize {display:none;padding:3px; margin:2px 1px 2px 1px; border:3px solid green; border-radius:3px; background-color:#fdfddf;} \
.ws_showContent_navbutton {color:blue;padding:1px; margin:-1em 1px 0px 1px; border:1px solid #bbaabb;border-right:3px solid #bbb1bb; border-radius:1px; background-color:#fdfddf;font-size:85%} \
")
 .appendTo("head");


//======================
// create the showContent box (in a moveable box with id=id
// if id ='' or not specifieid, ws_showContent_main is used
// note use of defaults in opts

function ws_showContent_init(id,opts) {

  var stuff='',aa,xclass=' ',zset='';
  var shclass='ws_showContent_shadow ';


  if (arguments.length<1 || id=='') id='ws_showContent_main';
  if (id.substr(0,1)=='#') id=id.substr(1);  // strip leading #

  if ($('#'+id).length>0) {
      alert('ws_showContent_init error: container with id=`'+id+'` exists');
      return 0;
  }

  if (arguments.length<2 || typeof(opts)!='object')  opts={};

  ws_setObjectDefault(opts,'callFunc','ws_showContent_toWindow,show content in a new window',0);   // ne double arrow action
  ws_setObjectDefault(opts,'callFuncHistory',0,2);   // extra function called if prior/next button clicked (noHistory!=1)  ( abbreviation match)
  ws_setObjectDefault(opts,'expandBox',1,2);          // abbreviation match

  ws_setObjectDefault(opts,'noHistory',0,2); // abbreviation match
  ws_setObjectDefault(opts,'noScroll',0,2);  // abbreviation match
  ws_setObjectDefault(opts,'noTopScroll','',2);  // abbreviation match
    if (opts['noTopScroll'] !='') opts['noScroll']=opts['noTopScroll'];       // alternate

  ws_setObjectDefault(opts,'noShadow',0,2);  // abbreviation match
  ws_setObjectDefault(opts,'noCloser2','0',0);   // case insenstive match (since noCloser is different than noCloser2
  ws_setObjectDefault(opts,'noMove','0',2);  // abbreviation match
  ws_setObjectDefault(opts,'header','',2);   // abbreviation match
  ws_setObjectDefault(opts,'zIndex','50',2);   // abbreviation match
    ws_setObjectDefault(opts,'z-Index','',2);   // abbreviation match
    if (opts['z-Index'] !='') opts['zIndex']=opts['z-Index'];       // alternate
  ws_setObjectDefault(opts,'enableEsc','1',2);                     // abbreviation match

stuff+=' <!-- the move showContent box used for various dynamic content --> ';

if (opts['noShadow']==1) shclass=' ';
if (!isNaN(opts['zIndex'])) zset=' style="z-index:'+opts['zIndex']+'" ';

stuff+='<div id="'+id+'"   class="ws_showContent_mainC   ' + shclass+' " '+zset+' xtitle=" ... content(in a moveable box) written here!"> ';

stuff+='  <div name="ws_showContent_headers" class="ws_showContent_headersC"> ';
stuff+='    <span name="ws_showContent_headers_perm"  > ';
if (opts['noCloser2']!=1) {
    if (opts['noCloser2']==0) {                         // bigger close button
       stuff+='       &nbsp; <input type="button"    value="x"  title="Close this"  style="cursor:pointer;margin:0px;padding:0px;font-size:80%" onClick="ws_showContent(this,1,1)">    ';
    } else {
       aa=(opts['noCloser2']).split(',');
       if (aa.length==1)aa.push('Close');
       if (aa.length==2) aa.push('');
       jQuery.each(aa,function(ii,vv){ aa[ii]=jQuery.trim(vv); });
       xclass=  (aa[2]!='') ?  aa[2]  : '' ;
       if (xclass=='') {
        stuff+='       &nbsp; <input type="button"   value="'+aa[0]+'"  title="'+aa[1]+'"  style="cursor:pointer;margin:1px;padding:4px;" onClick="ws_showContent(this,1,1)">    ';
       } else {
         stuff+='       &nbsp; <input type="button"   value="'+aa[0]+'"  title="'+aa[1]+'"  class="'+xclass+'" onClick="ws_showContent(this,1,1)">    ';
       }
    }
}   // nocloser2=1 : do NOT include a ws_showContent close button

if (opts['noHistory']!=1) {

  stuff+='       <input type="button"  name="ws_showMessagesInNewWindow" value="&#9111;"  title="view prior message"  style="margin:3px 2px 3px 2px" funcHistory="'+opts['callFuncHistory']+'" ';
  stuff+='                onClick="ws_showContent_history(this,-1)" dire="-1" > ';
  stuff+='       <input type="button"  name="ws_showMessagesInNewWindow" value="&#9112;"  title="view next message"  style="margin:3px 2px 3px 2px" funcHistory="'+opts['callFuncHistory']+'" ';
  stuff+='                onClick="ws_showContent_history(this,1)" dire="1" > ';
}

if (opts['header']!='') {
   stuff+=opts['header'];
}

stuff+='   <span   name="ws_showContent_headers_transient"> ';
stuff+='        &nbsp; ';
stuff+='   </span>  ';

stuff+='   <span  style="float:right;margin:5px 10em 5px 5px" name="ws_showContent_headers_permButtons" > ';
  if (opts['noScroll']!=1)  {
      stuff+='       <input  class="ws_showContent_navbutton" type="button"  value="&#11161;"  title="scroll up &#013;rmb: top of view box&#013; Double click: several rows up"            todo="top"     oncontextmenu="return false;" > ';
      stuff+='       <input  class="ws_showContent_navbutton"  type="button" value="&#11162;"  title="scroll right &#013;rmb: right border of view box,&#013; Double click: several spaces right" todo="right"  oncontextmenu="return false;"  > ';
      stuff+='       <input  class="ws_showContent_navbutton" type="button"  value="&#11163;"  title="scroll down &#013;rmb:  bottom of view box&#013; Double click: several rows dow"       todo="bottom" oncontextmenu="return false;"  > ';
      stuff+='       <input class="ws_showContent_navbutton"  type="button"  value="&#11160;"  title="scroll left &#013;rmb: left border of view box&#013; Double click: several spaCes left" todo="left"  style="margin-right:3em"  oncontextmenu="return false;"  > ';
  }
stuff+='   </span>  '

stuff+='<br clear="all" />';

stuff+='  </div> ';

stuff+='  <div name="ws_showContent_content" class="ws_showContent_contentC"> ';
stuff+='     content here ';
stuff+='  </div> ';
stuff+='       ';
stuff+='</div> ';
$(document.body).append(stuff);


arf=ws_addEventsNew('#'+id+' .ws_showContent_navbutton','mouseup',ws_showContent_top);

//e1=$('#'+id+'.ws_showContent_navbutton') ;
//e1.on('mouseup',ws_showContent_top);

if (opts['enableEsc']>1) opts['escapeOrder']=opts['enableEsc'];

ws_moveBoxCreate(id,opts);

if (opts['enableEsc']==1) {
    $(document).keyup(ws_moveBox_doEsc) ;
}

}

//============
// find dom inside a showContent window. Return jquery object to it (with length=0 if no match)
//  adom: jquery string to identify object.
//     examples: '#myDIv', '[name="thisBoxButton"]',  '.hotLink'
//  anid: id of the show content box to look within. If not specified, or '' or 0, use '#ws_showContent_main
function ws_showContent_find(adom,anid) {
   var e1,e2;
  anid=jQuery.trim(anid);
  if (anid.substr(0,1)!='#') anid='#'+anid ;
  if (arguments.length<2 ||anid==0 || jQuery.trim(anid)=='') anid= '#ws_showContent_main';
  e1=$(anid);
  e2=e1.find(adom);
  return e2;
}

//===================
// write content to a showCOntent div (or do other stuff, depending on opts)

function ws_showContent(aresponse0,opts,arg3)  {

   var e0,tt,e1a,noheader=0,eh,nowDisplay,contentHistory,eh2,noHeaderPerm=0,e1,e2;
   var useId='#ws_showContent_main';                                        // the default id (say, if  ws_showContent('','{'init':1}) );
   var doAppend=0,tmp1,noheaderPerm,doMinimize,doContentOnly=0;
   var ih,handlers,aevent,alookfor,afunc,aresponse1 ;
   var eparent,efull,iexpand;

   if (arguments.length==3)   {        // shortcut OR  special case: click on a close button in box. Close the movebox parent
      if (arg3=='1'  ) {      // typeof($aresponse0
       e1=$(aresponse0)  ;          // the jquery object of the showcontent box that contains the button
       e2=e1.closest('.ws_moveBox');
       ws_moveBoxDoClose('close',e2);
       return 1;

     }  else {
        let tmp=opts;
        opts={};
        opts[arg3]=aresponse0;
        opts['id']=tmp;
     }
   }        // 3args

   if (arguments.length<1)  opts={'hide':1};              // no arguments: close the "default box"
   if (typeof(opts)=='string') {
       opts={'id':opts};
   }
   if (typeof(opts)!=='object')   opts={};        // no opts (not even a string) : emtpy
   useId=ws_setObjectDefault(opts,'id',useId);      // note the default set above


   if (useId.substr(0,1)!='#') useId='#'+useId;
   ws_setObjectDefault(opts,'hide',0); opts['hide']=parseInt(opts['hide']) ;
   ws_setObjectDefault(opts,'close',0); opts['close']=parseInt(opts['close']) ;

   if (opts['close']==1) opts['hide']=1;

   ws_setObjectDefault(opts,'show',0); opts['show']=parseInt(opts['show']) ;
   ws_setObjectDefault(opts,'toggle',0); opts['toggle']=parseInt(opts['toggle']) ;

   ws_setObjectDefault(opts,'onTop',0); opts['onTop']=parseInt(opts['onTop']) ;

   ws_setObjectDefault(opts,'get','');

   var doForeground=ws_setObjectDefault(opts,'foreGround','',2);  // abbreviation match

   ws_setObjectDefault(opts,'dom','0');
   ws_setObjectDefault(opts,'dims','0');
   ws_setObjectDefault(opts,'visible','0');
   ws_setObjectDefault(opts,'full','0',2);   //0 : nothing, 1: make full screen, 2: make non-full screen, 3: toggle

   doAppend=ws_setObjectDefault(opts,'append',0);
   doContentOnly=ws_setObjectDefault(opts,'contentOnly',0);

    noheader=ws_setObjectDefault(opts,'noHeader',0);
    noheaderPerm=ws_setObjectDefault(opts,'noHeaderPerm',0);
    headers=ws_setObjectDefault(opts,'headers','',0);
    if (headers=='') {
       headers=ws_setObjectDefault(opts,'header','',0);
    }
    doMinimize=ws_setObjectDefault(opts,'doMinimize',0);
    if (jQuery.trim(doMinimize)=='' || doMinimize==0) doMinimize='';

    handlers=ws_setObjectDefault(opts,'events',[]);
    if (!jQuery.isArray(handlers)) handlers=[];

    e0=$(useId);
    if (e0.length!=1) {
       alert('ws_showContent error: no such id= '+useId+'\n '+aresponse0);
       return 0;
    }

    if (opts['onTop']==1)   ws_moveBoxDoZindex(e0,1);
    if (opts['onTop']==-1)   ws_moveBoxDoZindex(e0,0);

   if (opts['toggle']>0) {    //  toggle view
     if (e0.is(':visible')) {
         opts['hide']=opts['toggle'];
     } else {
         opts['show']=opts['toggle'];
     }
   }

   if (opts['hide']>0) {    // just hide it. Note this is done if NO arguments
     if (opts['hide']==1) {
        e0.hide();
     } else {
         e0.fadeOut(opts['hide']) ; // default "swing" easing
     }
     return 1;
   }



   if (opts['show']>0) {      // just show it
     if (opts['show']==1) {
        e0.show();
     } else {
         e0.fadeIn({'duration':opts['show'],'easing':'linear'} ) ;
         e0.show();
     }
     return e0;
   }
   if (opts['full']!=0) {      // make the parent move box full screen (if toggle=1, toggle it)
     eparent=e0.closest('.ws_moveBox');
     efull=eparent.find('[name="ws_moveBox_expander"]');
     if (efull.length==1) {
         iexpand=efull.attr('expanded');
         if (opts['full']==1 && iexpand==0)  {
            if (iexpand==0) {          //expand
               efull.trigger('click');
            }
         }  else if (opts['full']==2)   {       // unfull
            if (iexpand==1) {
                efull.trigger('mouseup');
            }
         } else {
                efull.trigger('mouseup');
         }
     }
     return 1;
   }


   if (opts['get']=='content' || opts['get']=='1') {      // return contentof content div
           e1=e0.find('[name="ws_showContent_content"]');
          return e1.html();
  }
  if (opts['get']=='header') {      // return contents of header div
           e1=e0.find('[name="ws_showContent_headers"]');
           return e1.html();
  }
   if (opts['dom']=='1') {      // return jquery ponter for content div
         e1=e0.find('[name="ws_showContent_content"]');
         return e1 ;
  }

   if (opts['dims']=='1' || opts['dims']=='2'  ) {      // return width x height of content area (in px)
      e1=e0.find('[name="ws_showContent_content"]');
      let isvis=e0.is(':visible');
      if (!isvis)  e0.show();
      let idiv= (opts['dims']==1) ? 1  : parseInt(e1.css('font-size'));
      let ww=e1.width()/idiv, hh=e1.height()/idiv;
      if (!isvis) e0.hide();
      return [ww,hh];
   }


   if (opts['visible']=='1') {      // return 0/1 (not visible, vixible)
         tt=0;
         if (e0.is(':visible')) tt=1;
         return tt;
   }



// show the moveable box that contains this showContent box
  e0.show();

  e1=e0.find('[name="ws_showContent_content"]');    // where to write content (and where history is stored)

   if (typeof(e1.data('contentHistory'))=='undefined')  {   // make sure contentHistory (and contentHistoryNow) exist
        e1.data('contentHistory',[]);
        e1.data('contentHistoryNow',0);
   }
   contentHistory=e1.data('contentHistory');     // modify & save ntentHistory and contentHistoryNow
   contentHistory.push(aresponse0);
   e1.data('contentHistory',contentHistory);
   nowDisplay=contentHistory.length-1;
   e1.data('contentHistoryNow',nowDisplay);

// append?
   if (doAppend==1) {

       tmp1=e1.html();       // the existing content
       aresponse1=tmp1+aresponse0;
       e1.html(aresponse1);
   } else {
      e1.html(aresponse0);
   }

   if (doContentOnly!=1) {
     eh=e0.find('[name="ws_showContent_headers"]');
     if (noheader==1) {         // do not show headers
         eh.hide();
     } else {             // show headers, perhaps also a transient header
        eh.show();
        eh1=eh.find('[name="ws_showContent_headers_perm"]');     // hide (but never change) permanent headers
        if (noHeaderPerm!=1) {
           eh1.show();
        } else {
           eh1.hide();
        }
        eh2=eh.find('[name="ws_showContent_headers_transient"]');
        eh2.html(headers);
        var qok,aoof;
        if (doMinimize!='')  {                                        // deal with minimize button
          oof=eh2.find('.ws_showContent_minimize_button');
          oof.each(function(index){
            aoof=$(this);
            qok=true;
            if (aoof.wsAttr('where',false,11)===false) {
                 alert('ws_showContent: minimize button specified without a `where` attribute: '+aoof.prop('outerHTML'));
                 qok=fals;
           }
          });
          if (!qok) return 0;
          oof.on('click',ws_showContent_minimize);
          if (doMinimize!='1') oof.val(doMinimize);
        }   // dominimize

     }   // noheader
   }  // docontentonly


// add foreground/backgroudn button?

  if (doForeground!='') {
     let zup= e0.find('[name="'+doForeground+'"]');
     if (zup.length>0) {
        for (let mm=0;mm<zup.length;mm++) {
          let zup1=zup[mm];
          let got1=ws_addEventsNew(zup1,'click');
          if (got1==1) continue ; // don't reaadd

          zup.on('click',{'dire':1},ws_moveBoxDoZindex) ;
          zup.on('contextmenu',{'dire':-1},ws_moveBoxDoZindex) ;
          zup.css({'cursor':'pointer'});
        }
     }
  }

// events?
   for (ih=0;ih<handlers.length;ih++) {
      aevent=handlers[ih][0]; alookfor=handlers[ih][1]; afunc=handlers[ih][2];
      if (typeof(afunc)!=='function') {
         alert('Error in showContent: an event handler function is not a function (for '+aevent+','+alookfor+','+afunc);
         return 1;
      }
      e1.find(alookfor).on(aevent,afunc);
//      $(alookfor,e1).on(aevent,afunc);
  }

  return e0 ;

}


//=========
// scroll to top of this box's content container

function ws_showContent_top(e) {
   var e1,eparent,e2;
   var snow,snow2,jheight,jwidth,awhat,ikey,jtime,mmult=1,tepx,Ltime,nowtime;
   var pxMove=10 ;             // size of up/donwn/left/rignt shift (in px)

   nowtime= new Date().getTime() ;  // use to detect double click

   e1=ws_argJquery(e);

   awhat=e1.attr('todo');
   ikey=e.which;

   LTime=0;
   var dattr=e1.attr('lastclicktime');
   if (typeof dattr !== typeof undefined && dattr !== false) LTime=dattr;
//   LTime=e1.wsAttr('lastclicktime',0,1);

   teps=Math.max(0,nowtime-LTime);
   if (teps<250) mmult=15  ;   // double click: 5x move (500 millisctones

 //   showStatusMessage([nowtime,LTime,teps,mmult].join(', '));

   e1.attr('lastclicktime',nowtime);
  
   eparent=e1.parents('.ws_moveBox');
   e2=eparent.find('[name="ws_showContent_content"]');
   if (awhat=='top')   {
      if (ikey==3) {
         e2.scrollTop(0);
         return 1;
      }
      snow=e2.scrollTop();
      snow2=Math.max(0,snow-(mmult*pxMove) );
      e2.scrollTop(snow2);
      return 1 ;

  } else if (awhat=='bottom') {
      jheight=e2[0].scrollHeight;
      if (ikey==3) {
         e2.scrollTop(Math.max(30,jheight-50));
         return 1;
      }
      snow=e2.scrollTop();
      snow2=Math.min(jheight,snow+(mmult*pxMove) );
      e2.scrollTop(snow2);
      return 1 ;

  } else if (awhat=='left') {
      if (ikey==3) {
         e2.scrollLeft(0);
         return 1;
      }
     jwidth=e2[0].scrollWidth;
      snow=e2.scrollLeft();
      snow2=Math.max(0,snow-(mmult*pxMove) );
      e2.scrollLeft(snow2);
      return 1 ;


  } else if (awhat=='right') {
      jwidth=e2[0].scrollWidth;
      if (ikey==3) {
         e2.scrollLeft(Math.max(30,jwidth-50));
         return 1;
      }
      snow=e2.scrollLeft();
      snow2=Math.min(jwidth,snow+(mmult*pxMove) );
      e2.scrollLeft(snow2);
      return 1 ;

  } else {
      alert('ws_showContent_top error (no such todo: '+todo);
  }
  return 1;

}

// show prior contents
function ws_showContent_history(e,idire) {
   var e1,eparent,contentHistory,e2,stuff,nowDisplay,stuff,foo ,aCh ,callFuncHistory ;
   e1=$(e);                 // called as showContent_top(this)
   callFuncHistory=e1.attr('funcHistory');

   eparent=e1.parents('.ws_showContent_mainC');
   e2=eparent.find('[name="ws_showContent_content"]');
   if (typeof(e2.data('contentHistory'))=='undefined')  {
        e2.data('contentHistory',[]);
        e2.data('contentHistoryNow',0);
   }
   nowDisplay=e2.data('contentHistoryNow');
   foo=nowDisplay;
   contentHistory=e2.data('contentHistory');
   nowDisplay=nowDisplay+idire;

   if (nowDisplay<0 || nowDisplay>=contentHistory.length) return 0 ;   // at ends
   e2.data('contentHistoryNow',nowDisplay);

   stuff=contentHistory[nowDisplay];
   e2.scrollTop
   e2.html(stuff);

   aCh=jQuery.trim(callFuncHistory);
   if (aCh!='' && aCh!='0') {
       if (typeof(window[callFuncHistory])!=='function') {
           alert('Error in ws_showContent_history: callFuncHistory is not a function: '+callFuncHistory);
           return 0;
       }
      window[callFuncHistory](e1,idire) ;   // e1 is jquery object of clicked button
   }

}



//==================
// toggle full size view of showContent  -- and show a unminmize button
// athis is the button pushed to invooke this. It should have a which button -- a button to be displayed that will call showContent_maximize
// Precisely : wishowContent_maximize_awhich
// this button will be unhidden

function ws_showContent_minimize(athis) {
  var q1 ,q1,awhich,q2a,ec,epaent,nowDisplay;
  if (typeof(athis.target)!=='undefined') {
     q2=$(athis.target);
  } else {
     q2=$(athis) ;
  }
  awhich=q2.attr('where') ;
  q2a=$('#'+awhich);
  if (q2a.length==0) {
      alert('ws_showContent_minimize error: no maximize button with id='+awhich);
      return 0;
  }

  eparent=q2.parents('.ws_moveBox');              // get the content, and jquery object, of this showContent continaer
  ec=eparent.find('[name="ws_showContent_content"]') ;

  if (typeof(ec.data('contentHistory'))=='undefined')  {
        ec.data('contentHistory',[]);
        ec.data('contentHistoryNow',0);
        nowDisplay=-1;
   } else {
      nowDisplay=ec.data('contentHistoryNow');
   }

  eparent.slideUp(110);           // hide the showContent container

  if (typeof(q2a.data('atarget'))=='undefined') {       // avoide double assigning click handlers
    q2a.data('atarget',eparent);      // save stuff to the maximize button
    q2a.data('hnum',nowDisplay);
    q2a.on('click',ws_showContent_maximize);
  } else {
    q2a.data('hnum',nowDisplay);
  }

  q2a.slideDown(250);
  q2a.show();

  return 1;

}


 //==================
// toggle full size view of showContent  -- and show a unminmize button
// athis is the button pushed to invooke this. It should have a which button -- a button to be displayed that will call showContent_maximize
// Precisely : wishowContent_maximize_awhich
// this button will be unhidden

function ws_showContent_maximize(athis) {

  var q1 ,q1,awhich,q2a,ec,contentHistory,e3;

  if (typeof(athis.target)!=='undefined') {
     q2=$(athis.target);
  } else {
     q2=$(athis) ;
  }

  q1=q2.data('atarget');   // the jquery object containing the showContent container
  hnum=q2.data('hnum');     // the element in the contenThistory (to display)

  q1.slideDown(110);     // hide the maximize button
  q2.slideUp(250);         // display the showContent container

  if (hnum<0) return 1;        // should not happen

  e3=q1.find('[name="ws_showContent_content"]') ;
  contentHistory=e3.data('contentHistory');
  e3.html(contentHistory[hnum]);

  return 1;
}


//=========
// display contents of a moveable box in new window -- generic version
// e1 is a jQuery object pointing to the moveable window.
function ws_showContent_toWindow(e1) {

  var e2,stuff0,atime,atimeMin,atimeshow,stuff,ascenario='',q1,da1='output' ;
  var aid=e1.attr('id');

   stuff0=ws_showContent('',{'id':aid,'get':'content'});

   da1=prompt('Title for output ','');

    atime=new Date() ;
    var atimeMin=atime.getMinutes();
    if (atimeMin<10) atimeMin='0'+atimeMin;
    atimeshow=atime.getHours()+":"+atimeMin+' '+atime.toDateString().substr(3) ;

  stuff='<html><head><title>retSim output</title>';
  stuff+= ' <meta charset="utf-8">';
  stuff+='<script type="text/javascript" src="../publicLib/jquery-1.10.2.js"></script>';
  stuff+='<link rel="stylesheet" type="text/css" href="/wsurvey/cssLib/wsurveyUtils.css" >';
  stuff+='</head><body>'
  stuff+='<div title="output from showContent"  style="border:1px solid blue;border-radius:4;margin:3px 2% 3px 2%;background-color:#efeee1">';
  stuff+=da1+' (<tt>@ '+atimeshow+'</tt>)</div>';
  stuff+=stuff0;
  stuff+='</body></html>';

  displayStringInWindow(stuff,0,0,'retSim output','_blank',1) ;
  return 1;

}



//=============================
// resize a ws_showContent box (its parent ws_moveBox)
// THis button starts the resizing-== using the "showCONtent" box it is in to dictate what to resize

function ws_showContent_resizeBox(athis) {
   var amess='';
   let ethis=ws_argJquery(athis);
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

   curOptions=ws_moveBoxDoResize(0,eparent);   // get current "permanent" specs

   amess+='<b>Change size and position of this viewing box.. </b>';
   amess+='<table cellpadding="2">';
   amess+='<tr><td align="left" width="30%">';
   amess+='<div style="border:1px dotted gold" ';
   amess+='  title="The permanent size and position of this content box is listed in these input fields. ';
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
   let ethis=ws_argJquery(athis) ;
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
   let newdo=ws_moveBoxDoResize(aspecs,eTopParent,1);     // test mode

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
    let ethis=ws_argJquery(athis) ;

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

   newOptions=ws_moveBoxDoResize(stuff,eparentBox); // make the change!

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
   ethis=ws_argJquery(athis);
   eparent=ethis.closest('.ws_showContentResizeMenu_c');
   eparent.remove();
}
//====================    foo   thisDayStep,thisDay ;


//==========
// close parent showContent window
function ws_showContent_close(athis,ebox) {
 var euse,e0,how;

  if (arguments.length>1) {               // called as function
     if (typeof(ebox)=='string')  {
         if (ebox.substr(0,1)!='#') ebox='#'+ebox;
         let euse=$(ebox);
         if (euse.length==0 || !euse.hasClass('ws_showContent_mainC')) {
            alert('ws_showContent_close error: '+ebox+' is not  showContent container');
            return 0;
         }
         e0=euse;

     } else {
         e0=$(ebox);  // might be a dom object?
         //alert("ooo "+e0.prop('outerHTML'));
     }
     how=parseInt(athis);


  } else {          // event hanbdler

     let ethis=ws_argJquery(athis);
     let eparent=ethis.closest('.ws_showContent_mainC');
     if (eparent.length!=1) {
        alert('ws_showContent_close error: not in a showContent container: '+ethis.prop('outerHTML'));
        return 1;
     }
     e0=$(eparent[0]);
     how=ethis.attr('how');
  }

  if (typeof(how)=='undefined') how=1;
  if (how==1) {
        e0.hide();
     } else {
     //  alert(e0.prop('outerHTML'));
     //  alert("faddd "+how);
         e0.fadeOut(how) ; // default "swing" easing
  }

  return 1;
}