REVOKE ALL ON FUNCTION private.org_has_members(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.org_has_members(uuid) TO authenticated, service_role;