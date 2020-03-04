
$(function () {

    $('.wrap').draggable();
});

$(document).ready(function () {
    // Двигаем окно
    $('#draggable').draggable();

    //Открыть/закрыть окно
    $('#btnWindowCloseId').click(function () {
        $('#draggable').hide();
    });
    $('#btnWindowHtmlId').click(function () {
        $('#draggable').toggle();
    });

    //Верхнее меню(скрыть/открыть)
    $('.main').mousemuve(function () {
        $('.main').toggle();
    });
});

//Выыбор html/css/js (в окне)
$('.html').show();

$("#selectItem").change(function () {
    $('.fixed-textarea').find('textarea').hide();
    let selected = $('#selectItem option:selected').attr('id');
    $('.' + selected).show();
});

$('document').ready(function () {
    $('.out').linenumbers({ col_width: '75px' });
})