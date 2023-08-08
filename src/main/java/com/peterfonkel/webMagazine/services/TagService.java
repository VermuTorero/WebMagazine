package com.peterfonkel.webMagazine.services;


import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.peterfonkel.webMagazine.entities.Click;
import com.peterfonkel.webMagazine.entities.Tag;
import com.peterfonkel.webMagazine.repositories.ClickDAO;
import com.peterfonkel.webMagazine.repositories.TagDAO;

@Service
@Transactional
public class TagService {
	
	@Autowired
	TagDAO tagDAO;
	
	public TagDAO getTagDAO() {
		return tagDAO;
	}

	public Tag getById(Long id) {
		return getTagDAO().getById(id);
	}

	

	
}
