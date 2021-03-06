﻿//# sourceURL=table.js

getVouchers();

var pageSize = 2;

function getVouchers() {
    var url = "/api/vouchers";
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            output("query successful, data received: " + JSON.stringify(data));
            setTable(data);
        },
        error: function (msg) {
            output(msg.responseText);
        }
    });
}

function setTable(data) {
    $('#tblContactsBody').empty();
    $('#tblContactsPager').empty();

    for (var i = 0; i < data.length; i += 1) {
        var item = data[i];
        $('#tblContactsBody').append(
          '<tr id="' + item.ID + '" style="cursor:pointer">' +
            '<td>' + item.ID + '</td>' +
            '<td>' + item.Text + '</td>' +
            '<td>' + item.Date + '</td>' +
            '<td>' + item.Amount + '</td>' +
            '<td>' + item.Paid + '</td>' +
          '</tr>');
    }
    $('#tblContactsBody').append("</table>");

    doPaging({ pagerSelector: '#tblContactsPager', showPrevNext: true, hidePageNumbers: false, perPage: pageSize, showAll: false }, $('#tblContactsBody'));

    $('#tblContactsBody tr').click(function (e) {
        console.info("selecting row with id=" + e.currentTarget.id);
    });
}

function doPaging(opts, tag) {
    var $this = tag,
        defaults = {
            perPage: 7,
            showPrevNext: false,
            hidePageNumbers: false,
            showAll: false
        },
        settings = $.extend(defaults, opts);

    var listElement = $this;
    var perPage = settings.perPage;
    var children = listElement.children();
    var showAll = settings.showAll;
    var pager = $('.pager');

    if (typeof settings.childSelector != "undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector != "undefined") {
        pager = $(settings.pagerSelector);
    }

    if (showAll === false) {
        var numItems = children.size();
        var numPages = Math.ceil(numItems / perPage);

        pager.data("curr", 0);


        if (settings.showPrevNext) {
            $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
        }

        var curr = 0;
        while (numPages > curr && (settings.hidePageNumbers === false)) {
            $('<li><a href="#" class="page_link">' + (curr + 1) + '</a></li>').appendTo(pager);
            curr++;
        }

        if (settings.showPrevNext) {
            $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
        }

        pager.find('.page_link:first').addClass('active');
        pager.find('.prev_link').hide();
        if (numPages <= 1) {
            pager.find('.next_link').hide();
        }
        pager.children().eq(1).addClass("active");

        children.hide();
        children.slice(0, perPage).show();

        pager.find('li .page_link').click(function () {
            var clickedPage = $(this).html().valueOf() - 1;
            goTo(clickedPage, perPage);
            return false;
        });
        pager.find('li .prev_link').click(function () {
            previous();
            return false;
        });
        pager.find('li .next_link').click(function () {
            next();
            return false;
        }
        );
    }

    if (showAll) {
        $('<li><a href="javascript:SwitchPaged(true)" class="show_all">Pager anzeigen</a></li>').appendTo(pager);
    } else {
        $('<li><a href="javascript:SwitchPaged(false)" class="show_all">Alle anzeigen</a></li>').appendTo(pager);
    }

    function previous() {
        var goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }

    function next() {
        var goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }

    function goTo(page) {
        var startAt = page * perPage,
            endOn = startAt + perPage;

        children.css('display', 'none').slice(startAt, endOn).show();

        if (page >= 1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }

        if (page < (numPages - 1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }

        pager.data("curr", page);
        pager.children().removeClass("active");
        pager.children().eq(page + 1).addClass("active");
    }
};

function output(msg) {
    console.log(msg);    
}