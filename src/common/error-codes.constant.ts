export class ErrorCodes {
  // Missing/Incorrect values
  static readonly ERR_MV_001 = 'ERR-MV-001'; // Missing Value for processing
  static readonly ERR_MV_002 = 'ERR-MV-002'; // Incorrect/unexpected Value for processing

  // Missing/Incompatible master or reference data
  static readonly ERR_MR_001 = 'ERR-MR-001'; // Missing Reference / Master Value
  static readonly ERR_MR_002 = 'ERR-MR-002'; // Incompatible Reference / Master Value

  // Errors on target records
  static readonly ERR_RC_001 = 'ERR-RC-001'; // Missing Record (e.g., wrong id)
  static readonly ERR_RC_002 = 'ERR-RC-002'; // Record with matching spec already exists
  static readonly ERR_RC_003 = 'ERR-RC-003'; // Record has already been processed

  // Errors on bad inputs
  static readonly ERR_IN_001 = 'ERR-IN-001'; // Missing required value
  static readonly ERR_IN_004 = 'ERR-IN-004'; // Validation Error

  // Internal/System errors
  static readonly ERR_EX_001 = 'ERR-EX-001'; // Internal processing error / system error

  // Access control errors
  static readonly ERR_AC_001 = 'ERR-AC-001'; // Missing or invalid roles / permissions
  static readonly ERR_AC_002 = 'ERR-AC-002'; // Account is blocked
  static readonly ERR_AC_003 = 'ERR-AC-003'; // Already logged in
  static readonly ERR_AC_004 = 'ERR-AC-004'; // Access denied - insufficient permissions

  // Configuration errors
  static readonly ERR_CN_001 = 'ERR-CN-001'; // Missing requried configuration
}
