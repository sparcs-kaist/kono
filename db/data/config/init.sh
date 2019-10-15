#!/bin/bash

echo "Creating users in initialized database:"
mysql -uroot -p$(cat /run/secrets/db_root_password)<<EOSQL
CREATE USER IF NOT EXISTS "sparcs_developer" IDENTIFIED BY "$(cat /run/secrets/db_dev_password)";
GRANT ALL PRIVILEGES ON TABLE kono.* TO "sparcs_developer";

CREATE USER IF NOT EXISTS "unauthorized_api" IDENTIFIED BY "$(cat /run/secrets/db_unauthorized_api_password)";
GRANT SELECT ON TABLE kono.* TO "unauthorized_api";

CREATE USER IF NOT EXISTS "api" IDENTIFIED BY "$(cat /run/secrets/db_authorized_api_password)";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE kono.* TO "api";
EOSQL
