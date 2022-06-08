
CREATE TABLE Courses_Filters
(
 id_1        NOT NULL,
 Courses_id int NOT NULL,
 Filters_id int NOT NULL,
 CONSTRAINT PK_19 PRIMARY KEY ( id_1 ),
 CONSTRAINT FK_14 FOREIGN KEY ( Courses_id ) REFERENCES Courses ( "id" ),
 CONSTRAINT FK_25 FOREIGN KEY ( Filters_id ) REFERENCES Filters ( "id" )
);

CREATE INDEX FK_16 ON Courses_Filters
(
 Courses_id
);

CREATE INDEX FK_27 ON Courses_Filters
(
 Filters_id
);



