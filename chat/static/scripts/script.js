$(function () {
    var INDEX = 0;
    var str = "";
    var audiomode = false;
    INDEX++;
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user \">";
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
        }, 500)

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
                data: input,
                type: "POST",
                dataType: 'json',
                url: "/chat/",
            }).done(function (data) {
                str = "";
                str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
                str += "          <div class=\"cm-msg-text\">";
                str += data['text'];
                str += "          <\/div>";
                str += "        <\/div>";
                debugger;
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

    var text = "Listening now";
    var ctr = 0;

    $("#chat-audio").click(function (e) {
        if (audiomode) {
            reset_audio();
        }
        else {
            audiomode = true;
            $("#chat-input").attr("disabled", true);
            $('.chat-logs').css({ opacity: 0.5 });
            $("#chat-audio").text("stop_circle");

            setInterval(listen_audio, 500);
            setTimeout(reset_audio, 6000);

            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "/speech/",
            }).done(function (data) {
                generate_message(data, 'self');

                setTimeout(function () {
                    generate_message(data, 'user');
                }, 1000)
            });
        }
        $(".loading").toggle();
    })

    function reset_audio() {
        clearInterval(listen_audio);
        text = "";
        audiomode = false;
        $("#chat-input").attr("disabled", false);
        $('.chat-logs').css({ opacity: 1.0 });
        $("#chat-audio").text("mic");
        $("#chat-input").val("");
        $(".loading").toggle();
    }

    function listen_audio() {

        if (!audiomode) {
            return;
        }

        text += ".";
        ctr++;

        if (ctr == 4) {
            text = "Listening now";
            ctr = 0;
        }

        $("#chat-input").val(text);
    }
})