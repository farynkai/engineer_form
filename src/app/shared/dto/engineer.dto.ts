export interface EngineerInputDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  framework: string;
  frameworkVersion: string;
  email: string;
  hobbies: object;
}

export interface Engineer {
  name: string;
}

export interface EngineersList {
  string: EngineerInputDto;
}

