$('#sidebarCollapse').on('click', () => {
    $('#sidebar').toggleClass('active');
    $('#content').toggleClass('active');
});

$('.nav-open-filter').on('click', () => {
    $('.filter-line').toggleClass('active-filter');
    $('.filter-items-box').toggleClass('show-filter');
});

$(function () {
    $(".accordion-content").css("display", "none");

    $(".accordion-click-element").click(function () {
        $(".open").not(this).removeClass("open").next().slideUp(300);
        $(this).toggleClass("open").next().slideToggle(300);
    });
});