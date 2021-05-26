\echo 'Delete and recreate inspire db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE inspire;
CREATE DATABASE inspire;
\connect inspire

\i inspire-schema.sql
\i inspire-seed.sql

\echo 'Delete and recreate inspire_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE inspire_test;
CREATE DATABASE inspire_test;
\connect inspire_test

\i inspire-schema.sql