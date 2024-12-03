SELECT * FROM prepare.physlogicaltable order by id desc;

select count(*) from prepare.physlogicaltable;


LOAD DATA  INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/A01289_alldata_1csv.csv' INTO TABLE prepare.physlogicaltable 
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\r\n'
(id,source,type,creationTimestamp,feature,value,SERIALNUMBER,DEVICECONNECTTIME);





SHOW VARIABLES LIKE "secure_file_priv";

LOAD DATA INFILE 'file.txt'
  INTO TABLE t1
  (column1, column2)
  SET column3 = CURRENT_TIMESTAMP;