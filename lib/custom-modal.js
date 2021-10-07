    $(document).ready(function () {

        var $content, $modal, $apnData, $modalCon;

        $content = $(".min");

        //To fire modal
        $(".mdlFire").click(function () {
            if ($(".modal-backdrop").length > 1) {
                $(".modal-backdrop")[1].classList.remove("display-none")
            } else {
                $(".modal-backdrop").removeClass("display-none");
            }

        });
        $(".modalMinimize").on("click", function () {
            $modalCon = $(this).closest(".mymodal").attr("id");

            $apnData = $(this).closest(".mymodal");

            $modal = "#" + $modalCon;

            $($modal).toggleClass("min");

            if ($($modal).hasClass("min")) {
                $(".modal-backdrop").addClass("display-none");
                $(".minmaxCon").append($apnData);

                $(this).find("i").toggleClass('bi-dash-lg').toggleClass('bi-window');

                let botones = document.querySelectorAll('button')
                botones.forEach(element => {
                    if (element.getAttribute('data-bs-target') == $modal) {
                        element.disabled = true
                    }
                });

            } else {
                if ($(".modal-backdrop").length > 1) {
                    $(".modal-backdrop")[1].classList.remove("display-none")
                } else {
                    $(".modal-backdrop").removeClass("display-none");
                }
                let botones = document.querySelectorAll('button')
                botones.forEach(element => {
                    if (element.getAttribute('data-bs-target') == $modal) {
                        element.disabled = false
                    }
                });

                document.body.classList.toggle('modal-open')
                $(".container").append($apnData);

                $(this).find("i").toggleClass('bi-window').toggleClass('bi-dash-lg');
            };

        });

        $("button[data-bs-dismiss='modal']").click(function (e) {
            let botones = document.querySelectorAll('button')
            botones.forEach(element => {
                if (element.getAttribute('data-bs-target') == `#${e.target.id}`) {
                    element.disabled = false
                }
            });
            $(".modal-backdrop").addClass("display-none");
            $(this).closest(".mymodal").removeClass("min");
            $(".container").removeClass($apnData);
            let icon = this.parentElement.querySelector('i').classList
            if (icon[0] == 'bi-window') icon.replace('bi-window', 'bi-dash-lg')

        });

    });