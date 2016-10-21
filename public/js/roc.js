/* Copyright 2016 Gagarine Yaikhom (MIT License) */
(function() {
    var container, svg, x, y, line;

    if (typeof roc === 'undefined')
        roc = {};

    function axes(width, height, margin) {
        var two_third = margin * 2 / 3;
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.svg.axis().scale(x).orient('bottom'));
        svg.append("text")
            .attr('class', 'x-label')
            .attr("transform", "translate(" + (width/2)
                  + "," + (height + two_third) + ")")
            .text("False Positive Probability");
        svg.append('g')
            .attr('class', 'y axis')
            .call(d3.svg.axis().scale(y).orient('left'));
        svg.append("text")
            .attr('class', 'y-label')
            .attr("transform", "translate(" + (-two_third)
                  + "," + (height/2) + ") rotate(-90)")
            .text("True Positive Probability");
        svg.append('line').attr('class', 'diagonal')
        .attr('x1', 0)
        .attr('y1', height)
        .attr('x2', width)
        .attr('y2', 0);
    }

    roc.point = function(tpr, fpr) {
        var point = svg.select('.roc-point'),
        coord = svg.select('.roc-point-coord'),
        displacement = 10;
        if (point.empty()) {
            point = svg.append('circle')
            .attr('class', 'roc-point')
            .attr('r', 4);
            coord = svg.append('text')
                .attr('class', 'roc-point-coord');
        }
        point.attr('cx', x(fpr))
            .attr('cy', y(tpr));
        coord.text('(' + fpr.toPrecision(2) + ', '
                   + tpr.toPrecision(2) + ')')
            .attr("transform", 'translate(' +
                  (x(fpr) + displacement) + ','
                  + (y(tpr) - displacement) + ')');
    }

    roc.path = function(data) {
        var path =  svg.select('.roc-path');
        if (path.empty())
            path = svg.append('path')
            .datum(data)
            .attr('class', 'roc-path')
            .attr('d', line);
        else
            path.datum(data)
            .attr('d', line);
    }

    roc.init = function(id, width, height, margin) {
        container = d3.select('#' + id);
        x = d3.scale.linear().domain([0, 1]).range([0, width]),
        y = d3.scale.linear().domain([0, 1]).range([height, 0]);
        line = d3.svg.line()
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });
        svg = container.append('svg')
            .attr('width', width + 2 * margin)
            .attr('height', height + 2 * margin)
            .append('g')
            .attr('transform', 'translate(' + margin
                  + ',' + margin + ')');
        axes(width, height, margin);
    }
})();
