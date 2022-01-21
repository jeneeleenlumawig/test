$(function () {
    var INDEX = 0;
    var str = "";
    INDEX++;
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + "user" + "\">";
    str += "          <div class=\"cm-msg-text\">";
    str += "Hi, How may I help you?";
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);

    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        generate_message(msg, 'self');

        setTimeout(function () {
            generate_message(msg, 'user');
        }, 1000)

    })

    function generate_message(input, type) {
        INDEX++;

        var str = "";

        if (type == 'self') {
            str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
            str += "          <div class=\"cm-msg-text\">";
            str += input;
            str += "          <\/div>";
            str += "        <\/div>";
            $(".chat-logs").append(str);
            $("#chat-input").val('');
        }
        else {
            $.ajax({
                data: {
                    msg: input,
                },
                type: "POST",
                url: "/get",
            }).done(function (data) {
                str = "";
                str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
                str += "          <div class=\"cm-msg-text\">";
                str += data;
                str += "          <\/div>";
                str += "        <\/div>";

                $(".chat-logs").append(str);
                $("#cm-msg-" + INDEX).hide().fadeIn(300);
                $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
            });
        }
    }

    $(document).delegate(".chat-btn", "click", function () {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})