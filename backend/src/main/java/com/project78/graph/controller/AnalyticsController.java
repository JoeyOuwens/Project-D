package com.project78.graph.controller;

import com.project78.graph.entity.Subject;
import com.project78.graph.entity.SubjectName;
import com.project78.graph.model.Messages;
import com.project78.graph.model.RadarChartData;
import com.project78.graph.repository.SubjectNameRepository;
import com.project78.graph.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class AnalyticsController {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectNameRepository subjectNameRepository;

    @GetMapping("eachReadSubject")
    public ArrayList<Map<String,Object>> get() {
        List<String> subjectNames;
        ArrayList<Map<String,Object>> data = new ArrayList<>();
        List<Subject> allMessages = (List<Subject>) subjectRepository.findAll();
        subjectNames = allMessages.stream().map(messages -> messages.getSubjectName()).distinct().collect(Collectors.toList());
        subjectNames.forEach(subjectName -> {
          Map<String,Object> barChartData = new HashMap<>();
          ArrayList<Integer> count = new ArrayList<>();
          count.add(subjectRepository.getBarChartData(subjectName));
          barChartData.put("label", subjectName);
          barChartData.put("data", count);
          data.add(barChartData);
        });
        return data;
    }

    @GetMapping("getCountOfImportantMessageRead")
    public Map<Object,Object> getCountOfImportantMessageRead() {
        List<Subject> subjectUuidsList;
        Map<Object,Object> pieChartData = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> counts = new ArrayList<>();
        subjectUuidsList = subjectRepository.getTheLastSevenSubject();
        subjectUuidsList.forEach(subject -> {
            labels.add(subject.getTitle());
            counts.add(subjectRepository.getReadCountSubject(subject.getUUID()));
        });
        pieChartData.put("labels", labels);
        pieChartData.put("data", counts);
        return pieChartData;
    }

    @GetMapping("getLikedMessages")
    public RadarChartData getLikedMessages() {
    RadarChartData chartData = new RadarChartData();
        List<SubjectName> subjectNamesList = (List<SubjectName>) subjectNameRepository.findAll();
        ArrayList<String> subjectName = subjectNamesList.get(0).getSubjectNamesList();
        subjectName.forEach(name -> {
            Map<String,Object> data = new HashMap<>();
            ArrayList<Integer> count = new ArrayList<>();
            count.add(subjectRepository.getLikedMessages(name));
            data.put("label", name);
            data.put("data", count);
            chartData.getData().add(data);
        });
        chartData.setLabels(subjectName);
        return chartData;
    }
}
