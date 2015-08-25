# Tabinput

![](https://www.dropbox.com/s/9ckojygs73bc9zf/jquery.tabinput.gif?dl=0&raw=1)

A simple jQuery plugin for adding tabable sections to an input box.

## Usage

    $('input').tabinput({
      format: 'MM/DD/YYYY',   //Default: 'MM/DD/YYYY'
      seperator: '/',         //Default: '/'
      filter: /[^0-9]/g,      //Default: false
      textAlign: 'center',    //Default: 'left'
      cursor: 'default',      //Default: 'text'
      placeholder: true,      //Default: true
      charWidth: 1,           //Default: 0.6
      widthUnit: 'em'         //Default: 'em'
    });

## Developing

    npm i && bower i
    gulp watch
