$(document)
.ready(function() {
    $('.ui.form .dropdown').dropdown();

    $('.ui.form')
    .form({
        fields: {
            options: {
                identifier  : 'options',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Моля изберете опция'
                    }
                ]
            },
            location: {
                identifier  : 'location',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Моля въведете град'
                    }
                ]
            }
        },
        onSuccess: function(event, fields) {
            var location = $(this).form('get value', 'location');
            var options = $(this).form('get value', 'options');

            var targetUrl = "http://api.openweathermap.org/" +
                "data/2.5/weather?q=" + encodeURIComponent(location) +
                "&lang=bg" +
                "&units=metric" +
                "&appid=d7519c1cfab7abb48907e2851e81f863";

            $.ajax({
                url: targetUrl
            })
            .done(function( data ) {
                if( data.cod != 200 ) {
                    alert(data.message);
                    return;
                }

                var iconUrl = 'http://openweathermap.org/img/w/';

                // TODO: Escape the values before concatenating them as HTML to avoid XSS vulnerabilities
                $('#cardContainer').append(
                    '<div class="column">' +
                        '<article class="ui card">' +
                            '<div class="content">' +
                                '<div class="header">' + data.name + '</div>' +
                                '<div class="meta">' +
                                    '<span class="right floated">' + data.main.temp + '&#8451</span>' +
                                    '<span class="category"><i class="' + data.sys.country.toLowerCase() + ' flag"></i></span>' +
                                    '</div>' +
                                '<div class="description">' +
                                    '<p>' +
                                    '<table class="ui very basic collapsing celled definition table">' +
                                        '<tbody>' +
                                            '<tr><td class="collapsing">Влажност</td><td>' + data.main.humidity + ' %</td></tr>' +
                                            (
                                                options == 2 || options >= 4 ?
                                                '<tr><td class="collapsing">Скорост на вятъра</td><td>' + data.wind.speed + ' м/сек</td></tr>' :
                                                ''
                                            ) +
                                            (
                                                options == 3 || options >= 4 ?
                                                '<tr><td class="collapsing">Атмосферно налягане</td><td>' + data.main.pressure + ' hPa</td></tr>':
                                                ''
                                            ) +
                                        '</tbody>' +
                                    '</table>' +
                                    '</p>' +
                                '</div>' +
                            '</div>' +
                            '<div class="extra content">' +
                                '<div class="right floated author">' +
                                    '<img class="ui avatar image" src="' + iconUrl + data.weather[0].icon + '.png">' + data.weather[0].description +
                                '</div>' +
                            '</div>' +
                        '</article>' +
                    '</div>'
                );

                // Scroll to bottom
                window.scrollTo(0,document.body.scrollHeight);
            });
        }
    });
});
