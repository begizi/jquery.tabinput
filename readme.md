# Tabinput

![](https://www.dropbox.com/s/9ckojygs73bc9zf/jquery.tabinput.gif?dl=0&raw=1)

A simple jQuery plugin for adding tabable sections to an input box.

## Usage

    $('input').tabinput({
      format: 'MM/DD/YYYY',   //Default: 'ABC-DEF-GHI'
      seperator: '/',         //Default: '-'
      type: 'text',           //Default: 'text'
      replace: /[^0-9]/g,     //Default: /[^a-zA-Z0-9]/g
      textAlign: 'center',    //Default: 'left'
      cursor: 'default',      //Default: 'text'
      placeholder: true       //Default: true
    });

## Developing

    npm i && bower i
    gulp watch
