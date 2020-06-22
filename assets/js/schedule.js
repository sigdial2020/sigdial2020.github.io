$(document).ready(function() {

    $.when(
        $.ajax({
           type: "GET",
           url: "content/schedule.csv",
           //dataType: "text",
           success: function(data1){
                schedule = data1;
            }
        }),
        $.ajax({
           type: "GET",
           url: "content/grouping.csv",
           //dataType: "text",
           success: function(data2){
                return data2;
            }
        })
    ).done(function ( v1, v2 ) {
        process(v1[0],v2[0])}
    )

    function process(schedule,grouping){
        papers_parsed=Papa.parse(grouping).data.slice(1)
        papers={}
        for (paper in papers_parsed){
            papers[papers_parsed[paper][0]]=papers_parsed[paper]
        }
        table_data=Papa.parse(schedule).data.slice(1)
        $(table_data).each(function (i, rowData) {
            id_row="schedule_"+i
            day_key="tab"+rowData[0][2]
            idx_color=get_color_idx(rowData[2])
            schedule_timeline=$("#schedule_timeline_"+rowData[0][2])
            row_event=$("<tr></tr>")

            append_date(rowData[1],rowData[0][2], row_event, rowData[3])

            //if (rowData[2]=="Break"){
            //    return;}
            //var row = $('<div class="row" id=schedule_'+i+'></div>');

            div_=$('<td></td>')
            div=$('<div class="member stephen" style="background:none;margin-bottom:0px" ></div>')

            microphone=''
            if (rowData[2]!= "Break"){
                microphone='<img src="assets/img/microphone.png">'
                }
            title='<a href="#" class="btn-large bg-'+idx_color+'">'+microphone+rowData[2]+'</a>'

            div.append($('<div class="button color" style="margin-top:-5%">'+title+'</div><h4>'+rowData[3]+'</h4></div>'))
            papers_ids=rowData[4].split(",")

            if (rowData[2]== "Keynote"){
                div.append($("<br><a href="+rowData[6]+">Abstract</a>"))
            }
            if (papers_ids != "" && rowData[2]=="Keynote"){
                if (["Prerecord stream","Session"].includes(rowData[2])){
                    div.append($("<h5>Prerecord stream:</h5>"))
                }
                for (idx in papers_ids){
                    paper_id=papers_ids[idx]
                    if (paper_id in papers){
                        div.append($("<p>"+papers[paper_id][2]+"<br>"+papers[paper_id][1]+" </p>"))
                    }
                }
            }
            div_.append(div)
            //row.append(div_)
            row_event.append(div_)
            schedule_timeline.append(row_event)
            //$("#"+day_key).append(row)
        });
    }

    function get_dates(date, day){
        countries=[-7,-6,-4,2,5.5,8,9]
        date_split=date.split(":")
        times=[]

        var d = new Date(Date.UTC(20, 7,parseInt(day), parseInt(date_split[0])+7, date_split[1], 0, 0));
        for (index = 0; index < countries.length; index++){
            date_=new Date(d.getTime()+ parseFloat(countries[index])*60*60*1000)
            var time = date_.toUTCString();
            //console.log(date_)
            //console.log(time)
            times.push(time.split(" ")[4].slice(0,5))
        }
        return times
    }

    function get_color_idx(type_key){
        if (["Live QA"].includes(type_key)){
            return 6
        }
        else {
            return 2
            }
    }

    function append_date(time_reference, day, row, title_schedule){
        dates=get_dates(time_reference ,day)
        for (index = 0; index < dates.length; index++){
            row.append($("<td style='vertical-align:middle'><h4>"+dates[index]+"</h4></td>"))

            //dates_str.push(dates[index])
        }

        //dates_str=dates_str.join(" ")
        //timeline.append($("<li class='color-"+idx_color+"'><a style='width:100%'  href=#"+id_row+">"+dates_str+"</a><br>"+title_schedule+"</li>"))
        //return title_schedule
        //return $("<td class='color-"+idx_color+"'><div class='col-md-5'><a style='width:100%'  href=#"+id_row+">"+dates_str+"</a></div><br></li>")
    }
   });
