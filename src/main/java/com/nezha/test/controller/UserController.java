package com.nezha.test.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {

	@ResponseBody
	@RequestMapping("/test")
	public String getTest(){
		return "this is a test";
	}
	
	@RequestMapping("/page")
	public String getPage(){
		return "index";
	}
	
	
}
