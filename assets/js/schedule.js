$(document).ready(function() {

    $.ajax({
       type: "GET",
       url: "/content/schedule.csv",
       dataType: "text",
       success: process
    });

    function process(data){
        table_data=Papa.parse(data).data.slice(1)
        table_html='<table class="col-md-12 board text-center"></table>'
        tables={tab1: $(table_html),tab2: $(table_html),tab3: $(table_html)}


        $(table_data).each(function (i, rowData) {
            var row = $('<tr></tr>');
            $(rowData).each(function (j, cellData) {
                if (j<2){
                    row.append($('<td>'+cellData+'</td>'));}
            });
            div=$('<td><div class="col-md-9 col-sm-12"></div></td>')
            title='<a name="oral1" href="#" class="btn-large bg-2"><img src="assets/img/microphone.png" alt="">'+rowData[2]+'</a>'
            div.append($('<div class="member stephen"><div class="button">'+title+'</div><p>'+rowData[3]+'</p></div></div>'))


            row.append(div)
            day_key="tab"+rowData[0][2]
            tables[day_key].append(row);
        });

        for (tab in tables){
            $("#"+tab).append(tables[tab])
        }

    }




   });
