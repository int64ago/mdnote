(function() {
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    var formatDate = function(date) {
        return new Date(date).Format("yyyy-MM-dd hh:mm:ss");
    };

    var id = window.location.pathname.substring(1);
    $.get('/api/note/' + id, function(data) {
        if (data && data.note) {
            $('textarea').val(data.note.text);
            $('#text-length').text(data.note.text.length);
            $('#visit-count').text(data.note.visitCount);
            $('#create-time').text(formatDate(data.note.create));
            $('#last-visit').text(formatDate(data.note.lastVisit));
            $('#last-update').text(formatDate(data.note.lastUpdate));
        } else {
            window.location.href = '/404';
        }
    });

    var isModified = false,
        downCount = 0;
    $('textarea').on('change keyup paste', function() {
        isModified = true;
        $('#text-length').text($('textarea').val().length);
        downCount = 10;
    });

    setInterval(function() {
        if (downCount > 0) {
            downCount -= 1;
        }
    }, 100);

    setInterval(function() {
        if (isModified && downCount === 0) {
            isModified = false;
            $.post('/api/note/' + id, {
                text: $('textarea').val()
            }, function(data) {
                if (data && data.note) {
                    $('#last-update').text(formatDate(data.note.lastUpdate));
                    $('#last-update').parent().addClass('green');
                    setTimeout(function() {
                        $('#last-update').parent().removeClass('green');
                    }, 1000);
                }
            })
        }
    }, 10);
})();
