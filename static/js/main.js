(function() {
    var id = window.location.pathname.substring(1);
    $.get('/api/note/' + id, function(data) {
        if (data && data.note) {
            $('textarea').val(data.note.text);
        } else {
            window.location.href = '/404';
        }
    });

    var isModified = false,
        modifyCount = 0,
        updateCount = -1;
    $('textarea').on('change keyup paste', function() {
        isModified = true;
        modifyCount = 10;
    });

    setInterval(function() {
        if (modifyCount > 0) {
            modifyCount -= 1;
        }
    }, 100);

    setInterval(function() {
        if (isModified && modifyCount === 0) {
            isModified = false;
            $.post('/api/note/' + id, {
                text: $('textarea').val()
            }, function(data) {
                if (data && data.note) {
                    updateCount = 0;
                }
            })
        }
    }, 10);

    setInterval(function() {
        if (updateCount >= 0) {
            $('#update-time').text('Updated ' + updateCount + 's ago');
            updateCount += 1;
        }
    }, 1000);
})();
